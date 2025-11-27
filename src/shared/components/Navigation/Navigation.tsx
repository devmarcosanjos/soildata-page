import { Link, useLocation } from 'react-router-dom';

interface MenuItemType {
  path: string;
  label: string;
  children?: { path: string; label: string; external?: boolean; href?: string }[];
}

const menuItems: MenuItemType[] = [
  {
    path: '/discover-soildata',
    label: 'Conheça o SoilData',
    children: [
      { path: '/project', label: 'O Projeto' },
      { path: '/about', label: 'Quem Somos' },
    ],
  },
  {
    path: '/data',
    label: 'Dados',
    children: [
      {
        path: '/dataverse',
        label: 'SoilData Repositório',
        external: true,
        href: 'https://soildata.mapbiomas.org/dataverse/soildata?q=',
      },
      { path: '/platform', label: 'Plataforma de Dados' },
      { path: '/statistics', label: 'Estatísticas' },
    ],
  },
  {
    path: '/methods',
    label: 'Métodos',
    children: [
      { path: '/methods/curation', label: 'Curadoria de dados' },
      { path: '/methods/integration', label: 'Integração dos dados' },
    ],
  },
  { path: '/faq', label: 'Perguntas Frequentes' },
  { path: '/contact', label: 'Contato' },
];

interface NavigationProps {
  mobile?: boolean;
}

export function Navigation({ mobile = false }: NavigationProps) {
  const location = useLocation();

  if (mobile) {
    return (
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-[calc(100vw-2rem)] max-w-sm p-3 shadow-lg navigation-text text-gray-500"
      >
        {menuItems.map((item) => {
          if (item.children) {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <details open={isActive}>
                  <summary 
                    className={`navigation-text ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}`}
                  >
                    {item.label}
                  </summary>
                  <ul className="p-2">
                    {item.children.map((child) => {
                      const childIsActive = !child.external && location.pathname === child.path;
                      if (child.external && child.href) {
                        return (
                          <li key={child.path}>
                            <a
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`navigation-text ${childIsActive ? 'active text-primary' : 'text-gray-500'}`}
                            >
                              {child.label}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`navigation-text ${childIsActive ? 'active text-primary' : 'text-gray-500'}`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`navigation-text ${isActive ? 'active text-primary' : 'text-gray-500'}`}
              >
                {item.label}
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
          const isActive = location.pathname === item.path || 
            item.children.some(child => location.pathname === child.path);
          return (
            <li key={item.path} className="dropdown-hover-menu">
              <div
                className={`navigation-text py-5 cursor-pointer ${
                  isActive
                    ? 'text-gray-700 font-semibold'
                    : 'text-gray-500 hover:text-orange-600 hover:underline hover:decoration-orange-600 hover:decoration-2 hover:underline-offset-4 hover:bg-transparent'
                }`}
              >
                {item.label}
              </div>
              <ul className="dropdown-menu rounded-box py-2 z-50 mt-0 dropdown-menu-custom">
                {item.children.map((child) => {
                  const childIsActive = !child.external && location.pathname === child.path;
                  if (child.external && child.href) {
                    return (
                      <li key={child.path} className="pl-0">
                        <a
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`dropdown-link ${childIsActive ? 'underline' : ''}`}
                        >
                          {child.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={child.path} className="pl-0">
                      <Link
                        to={child.path}
                        className={`dropdown-link ${childIsActive ? 'underline' : ''}`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        const isActive = location.pathname === item.path;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`navigation-text py-5 ${
                isActive
                  ? 'text-gray-700 font-semibold'
                  : 'text-gray-500 hover:text-orange-600 hover:underline hover:decoration-orange-600 hover:decoration-2 hover:underline-offset-4'
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
