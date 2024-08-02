import React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";

const CatalystBadge = () => {
  return (
    <Svg
      style={{ borderRadius: 5, overflow: "hidden" }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <Rect width="24" height="24" fill="#FFEB3B" />
      <G clipPath="url(#clip0_9_8)">
        <Path
          d="M12.5378 9.91511C11.9585 9.87821 11.3974 9.87448 10.8233 9.98341C10.2706 10.0883 9.76092 10.3593 9.33948 10.727C8.40835 11.5394 8.23117 13.1745 9.18322 14.0479C10.1098 14.8979 11.4519 14.7048 12.5553 14.3627C13.0487 14.2097 13.576 14.0251 13.9952 13.7166C14.5848 13.2826 15.0206 12.664 15.0193 11.9044C15.0182 11.1927 14.5855 10.5088 13.9383 10.2084C13.2544 9.89091 12.5844 9.93924 11.8601 10.0465C11.3645 10.1199 10.8769 10.2472 10.4086 10.4255C9.72001 10.6877 9.0593 11.0218 8.8151 11.7766C8.54062 12.6251 9.03048 13.5292 9.89119 13.7642C10.3989 13.9029 10.9501 13.7955 11.4621 13.7414C12.0141 13.6831 12.609 13.668 13.0981 13.3707C13.8419 12.9184 14.1077 11.997 13.6647 11.2314C13.2455 10.5069 12.3956 10.3475 11.6286 10.3868C10.744 10.4322 9.88585 10.843 9.64069 11.7654C9.40609 12.6482 10.0236 13.5463 10.8973 13.7314C11.7343 13.9088 12.4288 13.5085 13.0146 12.9471C13.3459 12.6295 13.4244 12.1105 13.2508 11.699C13.0735 11.2789 12.6669 11.0047 12.2067 10.9967C11.9767 10.9928 11.7466 10.9888 11.5166 10.9848C10.9188 10.9745 10.3468 11.5177 10.3741 12.1273C10.4022 12.7552 10.876 13.2588 11.5166 13.2698C11.7466 13.2738 11.9767 13.2778 12.2067 13.2817L11.3988 11.3314C11.3516 11.3766 11.3045 11.4219 11.2557 11.4655C11.2232 11.4947 11.19 11.5232 11.1561 11.5509C11.2943 11.4477 11.3279 11.4206 11.2569 11.4696C11.2171 11.4923 11.0096 11.597 11.1969 11.5206C11.3859 11.4434 11.1491 11.5248 11.1016 11.5329L11.4053 11.4921C11.3528 11.4967 11.3047 11.4973 11.252 11.4941L11.5557 11.5349C11.5156 11.5295 11.4684 11.5099 11.4297 11.5105C11.3742 11.4935 11.3958 11.504 11.4946 11.5418C11.5981 11.5897 11.6133 11.5943 11.5404 11.5558C11.5498 11.5626 11.7599 11.7474 11.6576 11.6423C11.7339 11.711 11.7867 11.7933 11.8161 11.8892C11.8557 11.9984 11.8642 12.0131 11.8418 11.9333L11.8826 12.237C11.8757 12.1997 11.8738 12.1622 11.8769 12.1244L11.8361 12.4281C11.8553 12.2954 11.9213 12.2679 11.7902 12.4886C11.6694 12.6307 11.6388 12.6693 11.6984 12.6043C11.7594 12.5416 11.7189 12.5689 11.577 12.6864L11.626 12.6547C11.725 12.6033 11.693 12.6161 11.53 12.6931C11.5477 12.7054 11.7062 12.653 11.728 12.6493L11.4243 12.6901C11.6688 12.6601 11.9241 12.6545 12.1695 12.6774L11.8657 12.6366C11.9097 12.643 11.9528 12.6527 11.9965 12.6598C12.1884 12.691 11.8255 12.5664 11.9225 12.625C11.9715 12.6559 11.9552 12.6427 11.8735 12.5854C11.8186 12.5554 11.7762 12.5129 11.7462 12.458C11.6892 12.3756 11.6756 12.359 11.7052 12.4081C11.7498 12.4867 11.7278 12.437 11.6391 12.2588L11.5983 11.9551C11.6057 11.9904 11.6077 12.0259 11.6044 12.0618L11.6452 11.7581C11.6233 11.8717 11.6493 11.8246 11.7232 11.6168C11.6659 11.7128 11.6994 11.6713 11.8237 11.4922C11.9996 11.3662 12.04 11.3347 11.9448 11.3977C11.8731 11.4354 11.8894 11.4308 11.9937 11.3839C12.2063 11.297 11.9861 11.3808 11.9385 11.3931C11.8725 11.4103 11.8056 11.4219 11.7383 11.4321L12.042 11.3913C11.7355 11.4304 11.4277 11.461 11.1203 11.4914C10.85 11.5181 10.5712 11.5647 10.2993 11.5395L10.6031 11.5804C10.5493 11.5722 10.3328 11.4997 10.5401 11.5814C10.6342 11.6092 10.7157 11.6595 10.7845 11.7324C10.969 12.1301 11.0357 12.235 10.9845 12.0473L11.0253 12.351C11.0191 12.2929 11.0201 12.2456 11.0276 12.1877L10.9868 12.4914C11.0222 12.3443 10.9376 12.5836 10.9271 12.606C11.0099 12.4291 10.7915 12.7621 10.8719 12.6778C10.9558 12.5899 10.6728 12.7974 10.7838 12.7456C10.8293 12.7243 10.8716 12.6934 10.917 12.6707C10.9477 12.6554 10.9944 12.6233 11.0285 12.6192L10.8796 12.6825C10.9136 12.6687 10.9476 12.6552 10.9819 12.6421C11.0845 12.6024 11.1879 12.5651 11.2923 12.5304C11.7103 12.3911 12.1401 12.2945 12.5765 12.2346L12.2727 12.2754C12.518 12.2444 12.7613 12.2227 13.0083 12.2461L12.7045 12.2053C12.7737 12.2151 12.9126 12.2762 12.9763 12.2647C12.7953 12.1824 12.7579 12.1673 12.8642 12.2192C12.8986 12.2375 12.9318 12.2578 12.9638 12.28C12.8127 12.1564 12.7797 12.1342 12.865 12.2133C12.9423 12.3007 12.9178 12.2688 12.7914 12.1177C12.8463 12.221 12.8315 12.1832 12.7468 12.0042C12.758 12.0421 12.7659 12.0807 12.7705 12.1199L12.7297 11.8162C12.7345 11.8769 12.7345 11.9323 12.73 11.9931L12.7708 11.6894C12.7619 11.7503 12.7487 11.8052 12.7332 11.8647C12.6856 12.0466 12.8392 11.6809 12.7629 11.7856C12.6375 11.9576 12.825 11.7654 12.8201 11.7274C12.8234 11.7528 12.6987 11.844 12.6849 11.8623C12.8261 11.7579 12.8613 11.7309 12.7905 11.7813C12.7647 11.8 12.7382 11.8178 12.711 11.8347C12.6659 11.8634 12.6193 11.8899 12.5722 11.9152C12.525 11.9407 12.4769 11.9647 12.4283 11.9876C12.3992 12.0013 12.3699 12.0146 12.3403 12.0274C12.2621 12.0617 12.3013 12.0451 12.4579 11.9776C12.3628 11.9776 12.2118 12.0722 12.1196 12.1036C11.9828 12.1501 11.8446 12.1922 11.7051 12.2296C11.4526 12.2973 11.1962 12.3489 10.9375 12.3863L11.2412 12.3455C11.0332 12.3721 10.827 12.383 10.618 12.3618L10.9217 12.4026C10.8568 12.3936 10.6704 12.3855 10.6265 12.3352C10.6671 12.3818 10.8914 12.4328 10.7107 12.3605C10.6149 12.3221 10.9001 12.5454 10.7787 12.4136C10.6719 12.2977 10.854 12.5068 10.8526 12.5209C10.8538 12.5086 10.795 12.4229 10.7844 12.405C10.7202 12.2966 10.8622 12.678 10.8314 12.5015C10.822 12.4476 10.8072 12.3951 10.799 12.3407L10.8398 12.6445C10.8284 12.5326 10.8301 12.4247 10.8443 12.3131L10.8035 12.6168C10.8154 12.5482 10.8526 12.4686 10.8564 12.4009C10.7727 12.5867 10.756 12.6267 10.8064 12.521C10.824 12.4871 10.8431 12.454 10.8638 12.4218C10.9303 12.3253 10.9057 12.3548 10.7901 12.5105C10.8153 12.4804 10.8418 12.4514 10.8693 12.4234C10.8969 12.3954 10.9256 12.3685 10.9552 12.3427C11.0452 12.268 11.0148 12.2911 10.8639 12.4121C10.9322 12.388 11.0022 12.3228 11.0677 12.2883C11.1031 12.2697 11.139 12.2522 11.1755 12.2357C10.994 12.3098 10.9588 12.3257 11.0698 12.2835C11.2385 12.2325 11.4024 12.1892 11.5773 12.163L11.2736 12.2038C11.6944 12.1509 12.116 12.1732 12.5378 12.2001C13.1355 12.2382 13.7068 11.6474 13.6803 11.0576C13.6512 10.4061 13.178 9.95588 12.5378 9.91511Z"
          fill="#FF4500"
        />
        <Path
          d="M11.5703 10.7076C11.4124 9.32063 11.3977 7.91953 11.5615 6.53203C11.6315 5.93971 11.6968 5.27695 11.935 4.7238C11.9883 4.59988 12.0583 4.47291 12.1386 4.37239C12.1426 4.36737 12.2492 4.21912 12.2794 4.24943C12.2924 4.26248 11.9652 4.31029 12.0442 4.26368C12.0455 4.26288 12.0159 4.23259 12.0225 4.22503C12.0301 4.21644 12.1438 4.41654 12.1622 4.46502C12.2024 4.57107 12.245 4.80933 12.2583 4.90007C12.3487 5.51609 12.3216 6.17437 12.2733 6.79282C12.1781 8.01318 11.8285 9.22653 11.2899 10.3236L13.3781 11.204C13.7767 9.80962 14.3813 8.50748 15.1954 7.30582C15.6506 6.63398 16.6145 5.04256 17.5892 5.76974C18.5109 6.45734 18.1837 7.66957 17.5488 8.43615C16.6421 9.53096 15.186 9.97542 13.887 10.4069C12.6108 10.8307 12.9313 12.5115 14.1907 12.6511C15.8291 12.8327 17.4674 13.0142 19.1058 13.1958C19.7617 13.2685 20.4473 13.2894 21.0898 13.4466C21.402 13.523 21.6253 13.5685 21.3811 13.8867C21.0736 14.2873 20.3478 14.3859 19.8886 14.4526C19.2845 14.5403 18.6389 14.5403 18.034 14.4564C16.8513 14.2924 15.6716 13.81 14.7401 13.0585C14.3757 12.7645 13.9479 12.6219 13.4921 12.8223C13.1024 12.9936 12.7554 13.4119 12.7898 13.8664C12.8957 15.2707 13.6122 16.3333 14.2709 17.5309C14.5136 17.9721 14.7849 18.4884 14.738 19.0095C14.7174 19.239 14.6159 19.658 14.3364 19.7183C13.6357 19.8695 13.3177 18.6461 13.2721 18.1748C13.141 16.8206 13.415 15.487 12.9935 14.1581C12.7236 13.3072 11.7372 13.0794 11.0839 13.6539C10.0777 14.5388 9.77515 15.8438 9.53375 17.1036C9.40955 17.7517 9.13215 19.3793 8.26977 19.364C7.31104 19.3468 7.30463 18.0386 7.61637 17.4212C8.21792 16.2299 9.59427 15.6638 10.7568 15.1755C11.3252 14.9367 11.7333 14.4199 11.5547 13.7701C11.3944 13.1867 10.7415 12.7905 10.1493 12.9721C8.73886 13.4047 7.29034 13.7358 5.8224 13.8965C4.92185 13.995 3.10873 14.3064 2.59047 13.2511C2.16209 12.3789 3.42902 11.9177 4.08535 12.0239C5.40233 12.237 6.34072 13.4132 7.16661 14.3549C7.91416 15.2074 9.43047 14.3079 9.07618 13.2433C8.60198 11.8186 8.12778 10.3938 7.65358 8.96897C7.46076 8.38961 7.20727 7.78554 7.15545 7.17263C7.13547 6.93631 7.17145 6.19193 7.57088 6.19789C7.59013 6.19818 7.57733 6.20618 7.55152 6.19908C7.68943 6.237 7.81605 6.55307 7.86579 6.67519C8.06278 7.15884 8.13113 7.71012 8.23231 8.21939C8.51628 9.6488 8.80027 11.0782 9.08424 12.5076C9.20454 13.1131 9.92576 13.4606 10.4897 13.3056C11.121 13.1321 11.4083 12.5074 11.2876 11.9002C10.9334 10.1171 10.6724 8.28179 10.2067 6.52466C9.80815 5.02121 8.64176 3.53451 6.89824 4.0209C4.99363 4.55223 4.62957 6.71664 5.06719 8.37014C5.5569 10.2205 6.2684 12.0348 6.87279 13.8508L8.78236 12.7392C7.48026 11.2544 5.96608 9.79282 3.86817 9.71893C1.95956 9.6517 0.0484859 11.212 0.247314 13.227C0.459148 15.3739 2.66682 16.3127 4.57865 16.2749C6.65458 16.2339 8.77845 15.7823 10.7568 15.1755L10.1493 12.9721C8.38878 13.7117 6.51272 14.5462 5.60227 16.3455C4.73708 18.0554 5.06318 20.3194 6.88256 21.2737C8.60054 22.1749 10.4025 21.2204 11.1674 19.5632C11.5178 18.8041 11.6676 18.0291 11.8323 17.2171C11.9787 16.4949 12.1267 15.7735 12.6997 15.2696L10.7901 14.7655C11.2864 16.33 10.6958 18.0225 11.2512 19.5957C11.7696 21.0639 13.28 22.3568 14.9287 21.9105C16.4845 21.4893 17.2025 19.8184 16.9697 18.3213C16.8413 17.4962 16.4619 16.7431 16.0436 16.0287C15.6534 15.3624 15.1348 14.6613 15.0748 13.8664L13.1244 14.6743C14.6056 15.8692 16.3152 16.5807 18.2136 16.7605C19.9598 16.9258 22.4495 16.6431 23.41 14.9508C23.923 14.0471 23.9073 12.8963 23.2049 12.0978C22.5761 11.383 21.65 11.2021 20.7494 11.0935C18.5659 10.8302 16.3766 10.6083 14.1907 10.3661L14.4945 12.6103C16.4336 11.9662 18.4037 11.2193 19.6154 9.47405C20.7635 7.82044 20.7779 5.46573 19.154 4.10999C15.2628 0.861285 12.0015 7.70409 11.1747 10.5965C10.827 11.8126 12.6811 12.6619 13.2629 11.4769C14.0604 9.85265 14.5269 8.10759 14.5864 6.29492C14.6363 4.77592 14.4866 2.60409 12.7259 2.08947C10.9813 1.57955 9.8363 3.35158 9.53887 4.81421C9.14486 6.75181 9.06179 8.74444 9.2853 10.7076C9.35509 11.3206 9.76045 11.8501 10.4278 11.8501C10.9912 11.8501 11.6406 11.3247 11.5703 10.7076Z"
          fill="#FF4500"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_9_8">
          <Rect
            width="23.534"
            height="20"
            fill="white"
            transform="translate(0.233032 2)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CatalystBadge;
