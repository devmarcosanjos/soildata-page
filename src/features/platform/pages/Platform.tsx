import { useEffect } from 'react';
import { /* Platform, */ ThemeProvider, BaseColorsKeys } from '@mapbiomas/ui';
import { Header } from '@/shared/components/Header';
// import {
//   PlatformSubheader,
//   PlatformMap,
//   PlatformStatistics,
//   PlatformLeftbar,
// } from '@/features/platform/components';
import { usePlatformStore } from '@/stores/platformStore';

export function PlatformPage() {
  const {
    headerHeight,
    setHeaderHeight,
    // selectedSoloDataset,
    // setSelectedSoloDataset,
    // mapStatistics,
    // setMapStatistics,
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
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-base-100)'
          }}>
            {/* Mensagem de em construção */}
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h1 className="text-4xl font-bold text-base-content mb-4">
                Em Construção
              </h1>
              <p className="text-lg text-base-content/70">
                Estamos trabalhando para trazer uma experiência incrível. Em breve!
              </p>
            </div>

            {/* Código original da plataforma - comentado */}
            {/* <div style={{
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
            </div> */}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
