
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PollutantDetailsProps {
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
}

const pollutantInfo = {
  pm25: {
    name: 'PM2.5',
    unit: 'μg/m³',
    description: 'Fine particulate matter that can penetrate deep into lungs and bloodstream. Linked to premature death, reduced lung function, respiratory issues, and increased risk of epilepsy.',
    healthRisk: 'High'
  },
  pm10: {
    name: 'PM10',
    unit: 'μg/m³',
    description: 'Inhalable particles that can induce adverse health effects and lung inflammation. Less harmful than PM2.5 but still poses respiratory risks.',
    healthRisk: 'Moderate'
  },
  o3: {
    name: 'Ozone (O3)',
    unit: 'ppb',
    description: 'Ground-level ozone that can cause respiratory symptoms, especially for sensitive individuals like children and elderly.',
    healthRisk: 'Moderate'
  },
  no2: {
    name: 'Nitrogen Dioxide (NO2)',
    unit: 'ppb',
    description: 'Gas that can increase risk of epilepsy and respiratory issues. Often comes from vehicle emissions and industrial sources.',
    healthRisk: 'Moderate'
  },
  so2: {
    name: 'Sulfur Dioxide (SO2)',
    unit: 'ppb',
    description: 'Gas that can cause respiratory issues and form secondary particles. Often from industrial processes and fossil fuel burning.',
    healthRisk: 'Low to Moderate'
  },
  co: {
    name: 'Carbon Monoxide (CO)',
    unit: 'ppm',
    description: 'Colorless, odorless gas that can affect oxygen delivery in the body, potentially leading to cardiovascular and neurological effects.',
    healthRisk: 'High at elevated levels'
  }
};

const PollutantDetails: React.FC<PollutantDetailsProps> = ({ pollutants }) => {
  const getPollutantLevel = (pollutant: keyof typeof pollutants, value: number): string => {
    // Simplified thresholds for demonstration
    switch (pollutant) {
      case 'pm25':
        if (value <= 12) return 'Good';
        if (value <= 35) return 'Moderate';
        return 'Unhealthy';
      case 'pm10':
        if (value <= 54) return 'Good';
        if (value <= 154) return 'Moderate';
        return 'Unhealthy';
      case 'o3':
        if (value <= 70) return 'Good';
        if (value <= 100) return 'Moderate';
        return 'Unhealthy';
      default:
        return 'Moderate';
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(pollutants).map(([key, value]) => {
        const pollutantKey = key as keyof typeof pollutants;
        const info = pollutantInfo[pollutantKey];
        const level = getPollutantLevel(pollutantKey, value);
        
        return (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">{info.name}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">{info.name}</p>
                    <p className="text-sm">{info.description}</p>
                    <p className="text-sm"><strong>Health Risk:</strong> {info.healthRisk}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-right">
              <div className="font-semibold">{value} {info.unit}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level)}`}>
                {level}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollutantDetails;
