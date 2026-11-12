        <button
          type="button"
          onClick={() => navigate('discover')}
          className="flex items-center gap-2.5 rounded-full transition duration-200 active:scale-[0.98]"
          aria-label="Profify"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* الفقاعة السفلية الفحمية (تشكل قاعدة حرف P) */}
            <path
              d="M9 17C9 12.0294 13.0294 8 18 8H21C25.9706 8 30 12.0294 30 17C30 21.9706 25.9706 26 21 26H15L9 32.5V17Z"
              fill="#121117"
            />
            {/* الفقاعة العلوية المرجانية المتداخلة (تشكل حلقة الحوار العليا لحرف P) */}
            <path
              d="M14 15.5C14 10.8056 17.8056 7 22.5 7H24.5C29.1944 7 33 10.8056 33 15.5C33 20.1944 29.1944 24 24.5 24H20L14 28.5V15.5Z"
              fill="#FF5A79"
              fillOpacity="0.92"
            />
            {/* نقطتا حوار ناعمتان داخل الفقاعة العليا */}
            <circle cx="21.5" cy="15.5" r="1.7" fill="#FFFFFF" />
            <circle cx="26.5" cy="15.5" r="1.7" fill="#FFFFFF" />
          </svg>

          <span className="text-xl font-extrabold tracking-tight text-[#121117]">
            Profify
          </span>
        </button>
