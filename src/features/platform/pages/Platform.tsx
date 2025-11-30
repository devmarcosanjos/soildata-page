import { useEffect } from 'react';
import { Platform, ThemeProvider, BaseColorsKeys } from '@mapbiomas/ui';
import { Header } from '@/shared/components/Header';
import {
  PlatformSubheader,
  PlatformMap,
  PlatformStatistics,
  PlatformLeftbar,
} from '@/features/platform/components';
import { usePlatformStore } from '@/stores/platformStore';

export function PlatformPage() {
  const {
    headerHeight,
    setHeaderHeight,
    selectedSoloDataset,
    setSelectedSoloDataset,
    mapStatistics,
    setMapStatistics,
  } = usePlatformStore();

  useEffect(() => {
    const updateHeaderHeight = () => {
      // Measure the header height rendered by the shared Header component
      const headerElement = document.querySelector('header[role="banner"]') as HTMLElement;
      if (headerElement) {
        const height = headerElement.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Aguardar um pouco para garantir que o DOM está renderizado
    const timeoutId = setTimeout(updateHeaderHeight, 0);
    updateHeaderHeight();
    
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeaderHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider selectedTheme="light" selectedBase={BaseColorsKeys.ORANGE_SOLO}>
      <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Header />
        <div style={{ 
          width: '100%',
          height: '100vh',
          paddingTop: `${headerHeight}px`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: `calc(100vh - ${headerHeight}px)`,
            overflow: 'hidden'
          }}>
            <Platform>
              <Platform.Subheader>
                <PlatformSubheader />
              </Platform.Subheader>
              <Platform.Leftbar>
                <PlatformLeftbar 
                  selectedSoloDataset={selectedSoloDataset}
                  onSoloDatasetChange={setSelectedSoloDataset}
                />
              </Platform.Leftbar>
              <Platform.Content>
                <PlatformMap 
                  selectedDatasetId={selectedSoloDataset}
                  onStatisticsChange={setMapStatistics}
                />
              </Platform.Content>
              <Platform.Rightbar>
                <PlatformStatistics statistics={mapStatistics} />
              </Platform.Rightbar>
            </Platform>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
