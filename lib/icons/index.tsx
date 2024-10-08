import React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import makeIcon from "../../assets/svgs/make-icon";

export const HomeIcon = makeIcon('HomeIcon', ({color, size = 24}) => (
        <Svg fill="none" viewBox="0 0 24 24" id="Home-Button-1--Streamline-Nova"
             height="24" width="24">
            <Path fill={color??"#000000"} fillRule="evenodd"
                  d="m3.29289 9.29289 -0.00454 0.00458 -1.99543 1.99543c-0.286 0.286 -0.371551 0.7161 -0.21677 1.0898 0.15478 0.3737 0.51942 0.6173 0.92388 0.6173H3v9c0 0.5523 0.44772 1 1 1h5v-6c0 -0.7956 0.31607 -1.5587 0.87868 -2.1213C10.4413 14.3161 11.2044 14 12 14c0.7956 0 1.5587 0.3161 2.1213 0.8787C14.6839 15.4413 15 16.2044 15 17v6h5c0.5523 0 1 -0.4477 1 -1v-9h1c0.4045 0 0.7691 -0.2436 0.9239 -0.6173 0.1548 -0.3737 0.0692 -0.8038 -0.2168 -1.0898l-2 -2.00001 -8 -8C12.5119 1.09763 12.2559 0.999996 12 1c-0.2559 -0.000004 -0.5118 0.09763 -0.7071 0.29289l-8.00001 8Z"
                  clipRule="evenodd" strokeWidth="1"></Path>
        </Svg>

    ))


export const HomeIconOutlined = makeIcon('HomeIconOutlined', ({color, size = 24}) => (
    <Svg fill="none" viewBox="0 0 24 24" id="Home-Button-1--Streamline-Nova"
         height="24" width="24">
        <Path fill={color ?? "#000"} fillRule="evenodd"
              d="M11.2929 1.29289c0.3905 -0.390521 1.0237 -0.390521 1.4142 0l10 10.00001c0.286 0.286 0.3716 0.7161 0.2168 1.0898 -0.1548 0.3737 -0.5194 0.6173 -0.9239 0.6173h-1v9c0 0.5523 -0.4477 1 -1 1H4.00003c-0.55229 0 -1 -0.4477 -1 -1v-9h-1c-0.40446 0 -0.7691 -0.2436 -0.92388 -0.6173 -0.154781 -0.3737 -0.06923 -0.8038 0.21677 -1.0898L11.2929 1.29289ZM12 3.41421l7 6.99999V21h-4v-4c0 -0.7956 -0.316 -1.5587 -0.8786 -2.1213C13.5587 14.3161 12.7957 14 12 14c-0.7956 0 -1.5587 0.3161 -2.12129 0.8787 -0.56261 0.5626 -0.87868 1.3257 -0.87868 2.1213v4h-4V10.4142L12 3.41421Z"
              clipRule="evenodd" strokeWidth="1"></Path>
    </Svg>
))

export const SearchIcon = makeIcon('SearchIcon', ({color, size = 24}) => (
    <Svg viewBox="0 0 24 24" id="Search--Streamline-Ultimate" height="24" width="24">
        <G>
            <Path
                d="m23.42 20.6 -5.06 -5.12a10 10 0 1 0 -2.81 2.84l5 5.09a2 2 0 0 0 2.83 0 2 2 0 0 0 0.04 -2.81ZM10 1.76A8.25 8.25 0 1 1 1.75 10 8.26 8.26 0 0 1 10 1.76Z"
                fill={color} strokeWidth="1"></Path>
            <Path d="M3.25 10.01a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 1 0 -13.5 0" fill={color} strokeWidth="1"></Path>
        </G>
    </Svg>
))

export const SearchIconOutlined = makeIcon('SearchIconOutlined', ({color, size = 24}) => (
    <Svg viewBox="-0.855 -0.855 24 24" id="Search--Streamline-Ultimate" height="24"
         width="24">
        <Path
            d="M1.36716191095825 12.405286235781249A8.417261250000001 8.417261250000001 0 1 0 16.86055000825625 5.820753369496249a8.417261250000001 8.417261250000001 0 1 0 -15.493388097298 6.584532866285Z"
            fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.71"></Path>
        <Path d="m15.06525375 15.064324999999998 6.528183749999999 6.5291125" fill="none" stroke={color??"#000000"}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.71"></Path>
    </Svg>
))

export const MessageIcon = makeIcon('MessageIcon', ({color, size = 24}) => (
    <Svg viewBox="0 0 24 24" id="Messages-Bubble-Typing-1--Streamline-Ultimate"
         height="24" width="24">
        <Path
            d="M12 1.38C5.68 1.38 0.54 5.61 0.54 10.82a8.56 8.56 0 0 0 3.16 6.51L1.42 21.9a0.5 0.5 0 0 0 0.08 0.57 0.51 0.51 0 0 0 0.36 0.15 0.49 0.49 0 0 0 0.21 0l6.13 -2.89a13.78 13.78 0 0 0 3.8 0.53c6.32 0 11.46 -4.24 11.46 -9.44S18.32 1.38 12 1.38Zm-5 11a1.5 1.5 0 1 1 1.5 -1.5 1.5 1.5 0 0 1 -1.5 1.5Zm5 -3a1.5 1.5 0 1 1 -1.5 1.5 1.5 1.5 0 0 1 1.5 -1.5Zm5 3a1.5 1.5 0 1 1 1.5 -1.5 1.5 1.5 0 0 1 -1.5 1.5Z"
            fill={color??"#000000"} strokeWidth="1"></Path>
    </Svg>
))

export const MessageOutlined = makeIcon('MessageOutlined', ({color, size = 24}) => (
    <Svg fill="none" viewBox="-0.855 -0.855 24 24"
         id="Messages-Bubble-Typing-1--Streamline-Ultimate" height="24" width="24">
        <Path stroke={color??"#000000"} strokeLinecap="round" strokeLinejoin="round"
              d="M11.831810625 0.69663587125C10.095419625 0.69413010375 8.39006745 1.1567488375 6.8926159625 2.0364887S4.160224175 4.181028175 3.3159439875 5.6996365875C2.4716638 7.218245 2.0488132125 8.935317999999999 2.091266375 10.67263775c0.04246245 1.737412625 0.5486776375 3.43173125 1.4661247499999999 4.907236374999999L0.6965625 21.593530375l6.007470775 -2.864265c1.2811827624999998 0.797517625 2.7299306 1.286411625 4.23209085 1.428138875 1.502067375 0.14163437499999998 3.0165800000000003 -0.06779874999999999 4.4241006249999995 -0.6118605 1.40742775 -0.543968875 2.66941325 -1.40779925 3.6865802499999996 -2.5231351249999996 1.017074125 -1.11542875 1.76146725 -2.4519928749999997 2.1744823749999997 -3.9044649999999996 0.413015125 -1.4523792500000001 0.48332149999999996 -2.981008875 0.205532375 -4.4652721125 -0.277882 -1.4842818125 -0.8963366249999999 -2.8837037375 -1.8066045 -4.0879767125 -0.9103607499999999 -1.2042729749999999 -2.087737125 -2.180500675 -3.4392541249999997 -2.8517361625C14.829444125 1.0417138625 13.340565 0.69380504125 11.831810625 0.69663587125v0Z"
              strokeWidth="1.71"></Path>
        <Path stroke={color??"#000000"}
              d="M11.8415625 10.796811625c-0.192344125 0 -0.34828125 -0.15593712499999998 -0.34828125 -0.34828125s0.15593712499999998 -0.34828125 0.34828125 -0.34828125"
              strokeWidth="1.71"></Path>
        <Path stroke={color??"#000000"}
              d="M11.8415625 10.796811625c0.192344125 0 0.34828125 -0.15593712499999998 0.34828125 -0.34828125s-0.15593712499999998 -0.34828125 -0.34828125 -0.34828125"
              strokeWidth="1.71"></Path>
        <Path stroke={color??"#000000"}
              d="M7.6621875 10.796811625c-0.1923534125 0 -0.34828125 -0.15593712499999998 -0.34828125 -0.34828125s0.1559278375 -0.34828125 0.34828125 -0.34828125"
              strokeWidth="1.71"></Path>
        <Path stroke={color??"#000000"}
              d="M7.6621875 10.796811625c0.1923534125 0 0.34828125 -0.15593712499999998 0.34828125 -0.34828125s-0.1559278375 -0.34828125 -0.34828125 -0.34828125"
              strokeWidth="1.71"></Path>
        <G>
            <Path stroke={color??"#000000"}
                  d="M16.0209375 10.796811625c-0.192344125 0 -0.34828125 -0.15593712499999998 -0.34828125 -0.34828125s0.15593712499999998 -0.34828125 0.34828125 -0.34828125"
                  strokeWidth="1.71"></Path>
            <Path stroke={color??"#000000"}
                  d="M16.0209375 10.796811625c0.192344125 0 0.34828125 -0.15593712499999998 0.34828125 -0.34828125s-0.15593712499999998 -0.34828125 -0.34828125 -0.34828125"
                  strokeWidth="1.71"></Path>
        </G>
    </Svg>
))

export const NotificationOutlined = makeIcon('Notification', ({color, size = 24})=> (
    <Svg viewBox="-0.855 -0.855 24 24" id="Alarm-Bell--Streamline-Ultimate"
         height="24" width="24">
        <Path d="M9.2875 20.2003125a1.93830125 1.93830125 0 0 0 3.71964375 0" fill="none" stroke={color??"#000000"}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.71"></Path>
        <Path d="m11.145 2.78625 0 -2.0896875" fill="none" stroke={color??"#000000"} strokeLinecap="round"
              strokeLinejoin="round" strokeWidth="1.71"></Path>
        <Path
            d="M11.145 2.78625a6.965624999999999 6.965624999999999 0 0 1 6.965624999999999 6.965624999999999c0 6.5439725 1.393125 7.6621875 1.393125 7.6621875H2.78625s1.393125 -1.7794849999999998 1.393125 -7.6621875A6.965624999999999 6.965624999999999 0 0 1 11.145 2.78625Z"
            fill="none" stroke={color??"#000000"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.71"></Path>
    </Svg>
))

export const NotificationSolid = makeIcon('NotificationSolid', ({color, size = 24})=> (
    <Svg viewBox="0 0 24 24" id="Alarm-Bell--Streamline-Ultimate" height="24"
         width="24">
        <G>
            <Path
                d="M21 17.5a1.5 1.5 0 0 1 -1.5 -1.5v-4.86A8 8 0 0 0 13 3.07V1a1 1 0 0 0 -2 0v2.07a8 8 0 0 0 -6.5 8.07V16A1.5 1.5 0 0 1 3 17.5a1 1 0 0 0 0 2h18a1 1 0 0 0 0 -2Z"
                fill={color??"#000000"} strokeWidth="1"></Path>
            <Path
                d="M14.24 21H9.76a0.25 0.25 0 0 0 -0.24 0.22 2.64 2.64 0 0 0 0 0.28 2.5 2.5 0 0 0 5 0 2.64 2.64 0 0 0 0 -0.28 0.25 0.25 0 0 0 -0.28 -0.22Z"
                fill={color??"#000000"} strokeWidth="1"></Path>
        </G>
    </Svg>
))

export const ProfileIcon = makeIcon('Profile', ({color, size = 24})=> (
    <Svg fill="none" viewBox="0 0 24 24" id="User-Profile-Circle--Streamline-Nova"
         height="24" width="24">
        <Path fill={color ?? "#000000"}
              d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236 3.35977 3.34094 1.8217 5.21509 0.913447 7.4078 0.00519562 9.60051 -0.232444 12.0133 0.230578 14.3411c0.463023 2.3278 1.605912 4.466 3.284142 6.1442 1.67823 1.6782 3.81643 2.8211 6.1442 3.2841 2.32778 0.463 4.74058 0.2254 6.93328 -0.6828 2.1927 -0.9083 4.0669 -2.4464 5.3854 -4.4198C23.2962 16.6935 24 14.3734 24 12c-0.0034 -3.18154 -1.2688 -6.23179 -3.5185 -8.48148C18.2318 1.26883 15.1815 0.00344108 12 0Zm0 22c-1.9778 0 -3.91121 -0.5865 -5.5557 -1.6853 -1.64449 -1.0988 -2.92622 -2.6606 -3.68309 -4.4879 -0.75688 -1.8272 -0.95491 -3.8379 -0.56906 -5.7777 0.38585 -1.93981 1.33826 -3.72164 2.73678 -5.12017C6.32746 3.53041 8.10929 2.578 10.0491 2.19215c1.9398 -0.38585 3.9505 -0.18782 5.7777 0.56905 1.8273 0.75688 3.3891 2.03861 4.4879 3.6831C21.4135 8.08879 22 10.0222 22 12c-0.0029 2.6513 -1.0574 5.1931 -2.9321 7.0679C17.1931 20.9426 14.6513 21.9971 12 22Z"
              strokeWidth="1"></Path>
        <Path fill={color ?? "#000000"}
              d="m5.454 15.941 1.092 1.676c1.64731 -1.047 3.5612 -1.5976 5.5131 -1.5861 1.9518 0.0116 3.8591 0.5847 5.4939 1.6511l1.112 -1.662c-1.9531 -1.3035 -4.2456 -2.0058 -6.5937 -2.0198 -2.34806 -0.014 -4.64875 0.6607 -6.6173 1.9408Z"
              strokeWidth="1"></Path>
        <Path fill={color ?? "#000000"}
              d="M16.5 9.5c0 -0.89001 -0.2639 -1.76004 -0.7584 -2.50006 -0.4945 -0.74003 -1.1973 -1.3168 -2.0195 -1.6574 -0.8223 -0.34059 -1.7271 -0.42971 -2.6 -0.25607 -0.8729 0.17363 -1.67474 0.60221 -2.30408 1.23155 -0.62934 0.62934 -1.05792 1.43116 -1.23155 2.30408 -0.17364 0.87291 -0.08452 1.7777 0.25607 2.6 0.3406 0.8222 0.91737 1.525 1.65739 2.0195C10.24 13.7361 11.11 14 12 14c1.1931 -0.0013 2.3369 -0.4759 3.1805 -1.3195 0.8436 -0.8436 1.3182 -1.9874 1.3195 -3.1805ZM12 12c-0.4945 0 -0.9778 -0.1466 -1.3889 -0.4213s-0.73158 -0.6652 -0.9208 -1.122c-0.18922 -0.4568 -0.23873 -0.95947 -0.14226 -1.44442 0.09646 -0.48496 0.33456 -0.93041 0.68416 -1.28005 0.3497 -0.34963 0.7951 -0.58773 1.2801 -0.68419 0.4849 -0.09646 0.9876 -0.04696 1.4444 0.14226 0.4568 0.18922 0.8473 0.50965 1.122 0.92078 0.2747 0.41112 0.4213 0.89447 0.4213 1.38892 0 0.32831 -0.0647 0.6534 -0.1903 0.9567s-0.3098 0.5789 -0.5419 0.8111c-0.2322 0.2321 -0.5078 0.4163 -0.8111 0.5419 -0.3033 0.1256 -0.6284 0.1903 -0.9567 0.1903Z"
              strokeWidth="1"></Path>
    </Svg>
))


export const ProfileIconSolid = makeIcon('ProfileSolid', ({color, size = 24}) => (
    <Svg viewBox="0 0 24 24" id="User-Profile-Circle--Streamline-Nova" height="24"
         width="24">
        <Path
            d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm0 5a4 4 0 1 1 -4 4 4 4 0 0 1 4 -4zm0 15a7.967 7.967 0 0 1 -6.27 -3.03 10.986 10.986 0 0 1 12.54 -0.01A7.958 7.958 0 0 1 12 20z"
            fill={color ?? "#000000"} strokeWidth="1"></Path>
    </Svg>
))