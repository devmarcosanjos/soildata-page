import { Breadcrumbs } from '@mapbiomas/ui';

export function PlatformSubheader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-size-large)',
      }}
    >
      <Breadcrumbs
        items={[
          {
            id: 1,
            label: 'América do Sul',
          },
          {
            id: 2,
            label: 'Brasil',
          },
        ]}
        onClick={() => {}}
      />
    </div>
  );
}

