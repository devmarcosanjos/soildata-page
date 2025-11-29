import { Navigation } from '../Navigation';
import { Logo } from '../Logo';
import { LanguageSelector } from '../LanguageSelector';

export function Header() {
  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-[1920px] mx-auto">
        <div className="navbar px-4 md:px-6 lg:px-0 min-h-[65px] pt-3 pb-3">
          <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-2 md:gap-3 lg:gap-0 px-2 md:px-4 lg:px-0">
            <Logo />

            <div className="hidden lg:flex flex-1 justify-center">
              <Navigation />
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              
              <div className="lg:hidden">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <Navigation mobile />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
