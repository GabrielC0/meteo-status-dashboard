import { describe, it, expect } from 'vitest';
import { mapToMarketDataStatus } from '@/utils/status-mapping';

describe('mapToMarketDataStatus', () => {
  it('retourne SUCCESS pour operational', () => {
    expect(mapToMarketDataStatus('operational')).toBe('SUCCESS');
  });

  it('retourne WARNING pour degraded et warning', () => {
    expect(mapToMarketDataStatus('degraded')).toBe('WARNING');
    expect(mapToMarketDataStatus('warning')).toBe('WARNING');
  });

  it('retourne ERROR pour outage et error', () => {
    expect(mapToMarketDataStatus('outage')).toBe('ERROR');
    expect(mapToMarketDataStatus('error')).toBe('ERROR');
  });

  it('retourne UNKNOWN pour toute autre valeur', () => {
    expect(mapToMarketDataStatus('something-else')).toBe('UNKNOWN');
  });
});
