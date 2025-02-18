import { Card, Text, Title } from '@tremor/react';

import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/cards/ChartCard.tsx
import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  subtitle, 
  children 
}) => (
  <Card className="h-[500px]">
    <div className="mb-10">
      <Title 
        className="text-xl font-medium mb-2"
        style={{ color: NOLK_COLORS.primary }}
      >
        {title}
      </Title>
      <Text
        className="text-sm"
        style={{ color: `${NOLK_COLORS.primary}b3` }}
      >
        {subtitle}
      </Text>
    </div>
    {children}
  </Card>
);