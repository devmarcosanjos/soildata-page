import type { Dataset } from '@/types/dataset';
import { Carousel } from '../Carousel';
import { DatasetCard } from '../DatasetCard';

interface PublicationsSectionProps {
  datasets: Dataset[];
  title?: string;
}

export function PublicationsSection({ 
  datasets, 
  title = 'ÚLTIMAS PUBLICAÇÕES' 
}: PublicationsSectionProps) {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center text-gray-700">
            {title}
          </h2>

          <div className="relative -mx-1 px-1">
            <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}>
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.doi} dataset={dataset} />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
