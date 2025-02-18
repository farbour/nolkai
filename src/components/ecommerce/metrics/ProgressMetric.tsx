import { ProgressBar, Text } from '@tremor/react';

import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/metrics/ProgressMetric.tsx
import React from 'react';

interface ProgressMetricProps {
  metric: string;
  current: number;
  target: number;
}

export const ProgressMetric: React.FC<ProgressMetricProps> = ({ 
  metric, 
  current, 
  target 
}) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <Text style={{ color: NOLK_COLORS.primary }}>
        {metric}
      </Text>
      <div className="flex items-center gap-2">
        <Text style={{ color: NOLK_COLORS.primary }}>
          {current}%
        </Text>
        <Text style={{ color: `${NOLK_COLORS.primary}80` }}>
          / {target}%
        </Text>
      </div>
    </div>
    <ProgressBar 
      value={(current / target) * 100} 
      color="emerald" 
      className="mt-2" 
    />
  </div>
);