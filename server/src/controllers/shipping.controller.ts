import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const EASYPOST_API_KEY = process.env.EASYPOST_API_KEY;

interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  rate: string;
  currency: string;
  deliveryDays: number;
  deliveryDate?: string;
}

export const getShippingRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fromZip, fromCountry, toZip, toCountry, weight, dimensions } = req.body;

    // If EasyPost API key is configured, use real API
    if (EASYPOST_API_KEY) {
      const response = await fetch('https://api.easypost.com/v2/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${EASYPOST_API_KEY}:`).toString('base64')}`,
        },
        body: JSON.stringify({
          shipment: {
            from_address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zip: fromZip || '10001',
              country: fromCountry || 'US',
            },
            to_address: {
              street: '456 Oak Ave',
              city: 'Los Angeles',
              state: 'CA',
              zip: toZip,
              country: toCountry || 'US',
            },
            parcel: {
              length: dimensions?.length || 12,
              width: dimensions?.width || 8,
              height: dimensions?.height || 4,
              weight: weight || 16,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('EasyPost API error');
      }

      const data = await response.json();
      const rates: ShippingRate[] = data.rates.map((rate: any) => ({
        id: rate.id,
        carrier: rate.carrier,
        service: rate.service,
        rate: rate.rate,
        currency: rate.currency,
        deliveryDays: rate.est_delivery_days,
        deliveryDate: rate.delivery_date,
      }));

      return res.json({ status: 'success', data: { rates } });
    }

    // Demo rates for development
    const demoRates: ShippingRate[] = [
      {
        id: 'rate_1',
        carrier: 'FedEx',
        service: 'Ground',
        rate: '9.99',
        currency: 'USD',
        deliveryDays: 5,
      },
      {
        id: 'rate_2',
        carrier: 'FedEx',
        service: 'Express',
        rate: '19.99',
        currency: 'USD',
        deliveryDays: 2,
      },
      {
        id: 'rate_3',
        carrier: 'UPS',
        service: 'Ground',
        rate: '8.99',
        currency: 'USD',
        deliveryDays: 5,
      },
      {
        id: 'rate_4',
        carrier: 'UPS',
        service: 'Next Day Air',
        rate: '29.99',
        currency: 'USD',
        deliveryDays: 1,
      },
      {
        id: 'rate_5',
        carrier: 'DHL',
        service: 'Express',
        rate: '24.99',
        currency: 'USD',
        deliveryDays: 3,
      },
    ];

    res.json({ status: 'success', data: { rates: demoRates } });
  } catch (error) {
    next(error);
  }
};

export const trackShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingNumber, carrier } = req.params;

    if (EASYPOST_API_KEY) {
      const response = await fetch(
        `https://api.easypost.com/v2/trackers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${EASYPOST_API_KEY}:`).toString('base64')}`,
          },
          body: JSON.stringify({
            tracker: {
              tracking_code: trackingNumber,
              carrier,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Tracking request failed');
      }

      const data = await response.json();
      return res.json({ status: 'success', data: { tracking: data } });
    }

    // Demo tracking for development
    const demoTracking = {
      trackingNumber,
      carrier,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          status: 'Picked up',
          location: 'New York, NY',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'In transit',
          location: 'Chicago, IL',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };

    res.json({ status: 'success', data: { tracking: demoTracking } });
  } catch (error) {
    next(error);
  }
};
