import { Accordion, RadioGroup, Tabs } from '@mapbiomas/ui';
import { EarthIcon, Settings2Icon } from 'lucide-react';
import { soloDatasetOptions } from '@/features/platform/data/soloDatasets';
import { useUIStore } from '@/stores/uiStore';
import { GranulometryFilters } from '../GranulometryFilters';

interface LeftMenuProps {
  selectedSoloDataset: string;
  onSoloDatasetChange: (value: string) => void;
  isMinimized?: boolean;
}

export function LeftMenu({ selectedSoloDataset, onSoloDatasetChange, isMinimized = false }: LeftMenuProps) {
  const { activeTab, setActiveTab } = useUIStore();

  const handleOpenPanel = () => {
    // Encontrar o botão padrão de toggle do MapBiomas UI
    // Primeiro, tentar encontrar pelo container do leftbar
    const container = document.querySelector('[data-platform-leftbar-content]') as HTMLElement;
    if (!container) {
      console.log('Container não encontrado');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    console.log('Container encontrado:', containerRect);

    // Procurar no elemento pai e irmãos
    let parent: HTMLElement | null = container.parentElement;
    let attempts = 0;
    
    while (parent && attempts < 10) {
      // Procurar por todos os botões no parent
      const buttons = parent.querySelectorAll('button, [role="button"], div[onclick], div[style*="cursor: pointer"]');
      console.log(`Tentativa ${attempts + 1}: Encontrados ${buttons.length} elementos clicáveis no parent`);
      
      for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i] as HTMLElement;
        
        // Ignorar elementos dentro do nosso container
        if (container.contains(element) || element.closest('[data-platform-leftbar-content]')) {
          continue;
        }
        
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        
        // Calcular distância da borda direita do container
        const distance = Math.abs(rect.left - containerRect.right);
        
        // Verificar sobreposição vertical
        const verticalOverlap = !(rect.bottom < containerRect.top - 300 || rect.top > containerRect.bottom + 300);
        
        console.log(`Elemento ${i}:`, {
          tag: element.tagName,
          distance,
          verticalOverlap,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          containerRight: containerRect.right
        });
        
        // Se está próximo (dentro de 200px) e na mesma área vertical
        if (distance < 200 && verticalOverlap) {
          console.log('Botão encontrado! Clicando...', element);
          element.click();
          return;
        }
      }
      
      // Tentar próximo nível de parent
      parent = parent.parentElement;
      attempts++;
    }
    
    // Última tentativa: procurar por qualquer elemento clicável próximo
    const allClickable = document.querySelectorAll('button, [role="button"], div[onclick], [style*="cursor: pointer"]');
    console.log('Busca global: Encontrados', allClickable.length, 'elementos clicáveis');
    
    for (let i = 0; i < allClickable.length; i++) {
      const element = allClickable[i] as HTMLElement;
      if (container.contains(element) || element.closest('[data-platform-leftbar-content]')) continue;
      
      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.left - containerRect.right);
      
      if (distance < 250 && rect.width > 0 && rect.height > 0) {
        console.log('Botão encontrado na busca global!', element, distance);
        element.click();
        return;
      }
    }
    
    console.log('Nenhum botão encontrado para abrir o painel');
  };

  if (isMinimized) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: 'var(--spacing-size-xxsmall)',
          padding: 'var(--spacing-size-small)',
          cursor: 'pointer',
        }}
        onClick={handleOpenPanel}
        title="Abrir painel de temas"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-size-xxsmall)',
            color: '#0F6C77',
            fontWeight: 600,
            fontSize: '0.85rem',
            justifyContent: 'center',
          }}
        >
          <Settings2Icon size={16} />
          <span>Temas</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '3px',
            borderRadius: '999px',
            backgroundColor: '#0F6C77',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        gap: 'var(--spacing-size-large)',
      }}
    >
      <div>
        <Tabs
          ariaLabel="Controles de visualização"
          items={[
            { id: 'themes', StartIcon: Settings2Icon, label: 'Temas' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <div
        style={{
          flex: 1,
        }}
      >
        <Accordion
          title="SOLO"
            icon={
              <div style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                backgroundColor: '#8B4513',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <EarthIcon size={16} color="#FFFFFF" />
              </div>
            }
            badgeLabel="Beta"
            initialExpanded={true}
            hasPlusMinusIcon={true}
            type="theme"
            color="#EA580C"
          >
            <div 
              id="solo-dataset-selection"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--spacing-size-small)',
                paddingTop: 'var(--spacing-size-small)',
              }}
              className="selecao-dados-soildata"
            >
              <RadioGroup
                options={soloDatasetOptions}
                value={selectedSoloDataset}
                onChange={onSoloDatasetChange}
                orientation="vertical"
                size="large"
                aria-label="Seleção de dataset de solo"
                aria-labelledby="solo-dataset-selection"
              />
            </div>
          </Accordion>
          
          {/* Filtros de Granulometria */}
          <GranulometryFilters />
        </div>
      </div>
  );
}
