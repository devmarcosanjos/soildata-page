import { useI18n } from '@/shared/hooks/useI18n';

const languageNames: Record<string, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
};

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useI18n();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        <span className="text-sm font-medium">{languageNames[currentLanguage]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-20 p-2 shadow-lg border border-gray-200"
      >
        {supportedLanguages.map((lang) => (
          <li key={lang}>
            <button
              onClick={() => changeLanguage(lang)}
              className={`text-sm ${
                currentLanguage === lang
                  ? 'bg-primary text-primary-content font-semibold'
                  : 'hover:bg-base-200'
              }`}
            >
              {languageNames[lang]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

