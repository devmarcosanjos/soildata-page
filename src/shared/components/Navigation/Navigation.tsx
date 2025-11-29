import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useI18n } from '@/shared/hooks/useI18n';

interface MenuItemType {
  path: string;
  labelKey: string;
  children?: { path: string; labelKey: string; external?: boolean; href?: string }[];
}

const menuItems: MenuItemType[] = [
  {
    path: '/',
    labelKey: 'discoverSoildata',
    children: [
      { path: '/project', labelKey: 'menu.project' },
      { path: '/about', labelKey: 'menu.about' },
    ],
  },
  {
    path: '/data',
    labelKey: 'data',
    children: [
      {
        path: '/dataverse',
        labelKey: 'menu.repository',
        external: true,
        href: 'https://soildata.mapbiomas.org/dataverse/soildata?q=',
      },
      { path: '/platform', labelKey: 'menu.platform' },
      { path: '/statistics', labelKey: 'menu.statistics' },
    ],
  },
  {
    path: '/methods',
    labelKey: 'methods',
    children: [
      { path: '/methods/curation', labelKey: 'menu.curation' },
      { path: '/methods/integration', labelKey: 'menu.integration' },
    ],
  },
  { path: '/faq', labelKey: 'faq' },
  { path: '/contact', labelKey: 'contact' },
];

interface NavigationProps {
  mobile?: boolean;
}

export function Navigation({ mobile = false }: NavigationProps) {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { currentLanguage } = useI18n();

  const getLocalizedPath = (path: string) => {
    return `/${currentLanguage}${path}`;
  };

  const isPathActive = (path: string) => {
    const pathWithoutLang = location.pathname.replace(/^\/(pt|en|es)/, '');
    return pathWithoutLang === path || pathWithoutLang.startsWith(path + '/');
  };

  if (mobile) {
    return (
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-[calc(100vw-2rem)] max-w-sm p-3 shadow-lg navigation-text text-gray-500"
      >
        {menuItems.map((item) => {
          if (item.children) {
            const isActive = isPathActive(item.path);
            return (
              <li key={item.path}>
                <details open={isActive}>
                  <summary 
                    className={`navigation-text ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}`}
                  >
                    {t(item.labelKey)}
                  </summary>
                  <ul className="p-2">
                    {item.children.map((child) => {
                      const childIsActive = !child.external && isPathActive(child.path);
                      if (child.external && child.href) {
                        return (
                          <li key={child.path}>
                            <a
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`navigation-text ${childIsActive ? 'active text-primary' : 'text-gray-500'}`}
                            >
                              {t(child.labelKey)}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={child.path}>
                          <Link
                            to={getLocalizedPath(child.path)}
                            className={`navigation-text ${childIsActive ? 'active text-primary' : 'text-gray-500'}`}
                          >
                            {t(child.labelKey)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            );
          }

          const isActive = isPathActive(item.path);
          return (
            <li key={item.path}>
              <Link 
                to={getLocalizedPath(item.path)} 
                className={`navigation-text ${isActive ? 'active text-primary' : 'text-gray-500'}`}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="menu menu-horizontal navigation-text text-gray-500 gap-5">
      {menuItems.map((item) => {
        if (item.children) {
          const isActive = isPathActive(item.path) || 
            item.children.some(child => isPathActive(child.path));
          return (
            <li key={item.path} className="dropdown-hover-menu">
              <div
                className={`navigation-text py-5 cursor-pointer ${
                  isActive
                    ? 'text-gray-700 font-semibold'
                    : 'text-gray-500 hover:text-orange-600 hover:underline hover:decoration-orange-600 hover:decoration-2 hover:underline-offset-4 hover:bg-transparent'
                }`}
              >
                {t(item.labelKey)}
              </div>
              <ul className="dropdown-menu rounded-box py-2 z-50 mt-0 dropdown-menu-custom">
                {item.children.map((child) => {
                  const childIsActive = !child.external && isPathActive(child.path);
                  if (child.external && child.href) {
                    return (
                      <li key={child.path} className="pl-0">
                        <a
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`dropdown-link ${childIsActive ? 'underline' : ''}`}
                        >
                          {t(child.labelKey)}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={child.path} className="pl-0">
                      <Link
                        to={getLocalizedPath(child.path)}
                        className={`dropdown-link ${childIsActive ? 'underline' : ''}`}
                      >
                        {t(child.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        const isActive = isPathActive(item.path);
        return (
          <li key={item.path}>
            <Link
              to={getLocalizedPath(item.path)}
              className={`navigation-text py-5 ${
                isActive
                  ? 'text-gray-700 font-semibold'
                  : 'text-gray-500 hover:text-orange-600 hover:underline hover:decoration-orange-600 hover:decoration-2 hover:underline-offset-4'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
