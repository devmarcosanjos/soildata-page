import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { LeftMenu } from './LeftMenu';
import { useUIStore } from '@/stores/uiStore';

interface PlatformLeftbarProps {
  selectedSoloDataset: string;
  onSoloDatasetChange: (value: string) => void;
}

export function PlatformLeftbar({ selectedSoloDataset, onSoloDatasetChange }: PlatformLeftbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMinimized, setIsMinimized } = useUIStore();

  useEffect(() => {
    const checkMinimized = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsMinimized(width < 100);
      }
    };

    checkMinimized();
    const resizeObserver = new ResizeObserver(checkMinimized);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setIsMinimized]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f9f6f2',
        borderRight: '1px solid rgba(234,88,12,0.2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
          boxSizing: 'border-box',
          overflow: 'hidden',
          padding: isMinimized ? 'var(--spacing-size-medium)' : 'var(--spacing-size-large)',
        }}
      >
        <LeftMenu 
          selectedSoloDataset={selectedSoloDataset}
          onSoloDatasetChange={onSoloDatasetChange}
          isMinimized={isMinimized}
        />
      </div>

      {/* Download Button */}
      {!isMinimized && (
        <div
          style={{
            padding: 'var(--spacing-size-large)',
            borderTop: '1px solid rgba(234,88,12,0.2)',
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#C55B28',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#A04820';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C55B28';
            }}
          >
            <Download size={18} />
            Download conjunto de dados
          </button>
        </div>
      )}
    </div>
  );
}
