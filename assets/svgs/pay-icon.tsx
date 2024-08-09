import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import makeIcon from './make-icon';

export default makeIcon('PayIcon', ({ color, size = 35 }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <G clipPath="url(#clip0_47_2)">
            <Path fillRule="evenodd" clipRule="evenodd" d="M8.15999 13.5001C9.24823 12.9322 10.0782 11.9699 10.48 10.8101C10.6232 10.3532 10.6105 9.86166 10.444 9.41276C10.2775 8.96385 9.96652 8.583 9.55999 8.33005C8.71999 7.74005 7.55999 8.10005 6.64999 8.55005C3.81999 10.0001 1.93999 12.5501 0.0599926 15.0901C0.0122537 15.155 -0.00771761 15.2363 0.00447226 15.316C0.0166621 15.3957 0.0600146 15.4673 0.124993 15.5151C0.189971 15.5628 0.271252 15.5828 0.350955 15.5706C0.430658 15.5584 0.502254 15.515 0.549993 15.4501C2.32999 13.3401 4.54999 10.7801 7.14999 9.59005C7.58999 9.39005 8.48999 9.01005 8.89999 9.29005C10.16 10.1501 8.89999 11.9801 7.69999 12.6601C7.41999 12.8201 6.21999 13.1001 6.11999 13.6601C6.31206 14.8398 6.36241 16.0383 6.26999 17.2301C6.26071 17.3269 6.29026 17.4234 6.35215 17.4984C6.41404 17.5734 6.50319 17.6208 6.59999 17.6301C6.6968 17.6393 6.79332 17.6098 6.86834 17.5479C6.94335 17.486 6.99071 17.3969 6.99999 17.3001C7.15962 16.2058 7.15962 15.0943 6.99999 14.0001C7.30999 14.1301 7.99999 13.5601 8.15999 13.5001Z" fill="#006400" />
            <Path fillRule="evenodd" clipRule="evenodd" d="M20.35 13.7301C20.2875 13.9225 20.186 14.1 20.0518 14.2515C19.9176 14.4029 19.7536 14.525 19.57 14.6101C18.57 15.2401 12.57 15.7601 12.41 14.5401C12.41 14.2601 12.54 14.2001 12.66 13.9401C12.78 13.6801 12.2 13.7301 11.88 14.1501C11.56 14.5701 11.64 15.7801 14.08 16.1501C13.46 16.5401 12.78 17.1501 13.08 17.8301C13.3278 18.4455 13.7944 18.9477 14.39 19.2401C13.0201 19.8378 11.614 20.3489 10.18 20.7701C9.59998 20.9701 8.62998 20.7701 8.31998 21.5901L7.65998 23.5301C7.64685 23.5675 7.64122 23.6071 7.64341 23.6467C7.6456 23.6864 7.65556 23.7251 7.67274 23.7609C7.68992 23.7966 7.71397 23.8287 7.74353 23.8551C7.77308 23.8816 7.80755 23.9019 7.84498 23.9151C7.88241 23.9282 7.92205 23.9338 7.96166 23.9316C8.00126 23.9295 8.04004 23.9195 8.07579 23.9023C8.11154 23.8851 8.14356 23.8611 8.17002 23.8315C8.19647 23.802 8.21685 23.7675 8.22998 23.7301C8.48851 23.1346 8.78582 22.5567 9.11998 22.0001C9.17998 21.8901 9.84998 22.0001 10.45 21.8801C12.0303 21.4121 13.5307 20.7075 14.9 19.7901C14.9 19.7901 15.16 19.6801 15.11 19.6101C15.1577 19.592 15.1993 19.5608 15.23 19.5201C15.4395 19.5406 15.6505 19.5406 15.86 19.5201C22.74 19.1301 22.31 15.9401 20.26 15.1001C20.5203 14.952 20.7317 14.7312 20.8685 14.4648C21.0053 14.1984 21.0614 13.8979 21.03 13.6001C21.03 13.3301 20.74 13.0901 20.53 12.9301C20.11 12.7701 19.64 12.9801 19.96 13.1901C20.28 13.4001 20.41 13.5101 20.35 13.7301ZM19.25 17.7301C18 18.2301 15 19.0001 14.12 17.5401C14.12 17.4901 14.18 17.3901 14.21 17.3501C15.34 15.8501 17.21 16.3501 18.42 15.9501C19.63 15.5501 21.84 16.8001 19.25 17.7601V17.7301Z" fill="#006400" />
            <Path fillRule="evenodd" clipRule="evenodd" d="M23.94 8.64004C23.86 5.34004 23.64 0.83004 23.58 0.64004C23.5355 0.537744 23.465 0.448861 23.3755 0.382205C23.2861 0.315549 23.1807 0.273435 23.07 0.26004C21.49 3.99947e-05 3.46998 -0.0999601 2.42998 1.23004C2.06998 1.69004 2.04998 9.06004 2.26998 11.06C2.28826 11.1319 2.33167 11.1948 2.39236 11.2374C2.45305 11.28 2.52698 11.2994 2.60076 11.2921C2.67454 11.2849 2.74328 11.2514 2.7945 11.1978C2.84573 11.1442 2.87606 11.0741 2.87998 11C2.74999 9.20906 2.74999 7.41102 2.87998 5.62004C3.74295 5.38399 4.59112 5.09682 5.41998 4.76004C6.34998 4.26004 6.83998 3.99004 8.35998 1.32004C9.75998 1.32004 17.95 1.14004 17.99 1.32004C18.68 2.57004 19.12 3.65004 20.46 4.37004C21.1826 4.62482 21.9437 4.75336 22.71 4.75004C22.76 5.75004 22.81 6.85004 22.85 7.88004C21.46 7.76004 19.39 8.42004 18.85 9.75004C18.6969 10.1197 18.6351 10.5209 18.6699 10.9195C18.7047 11.3181 18.8351 11.7025 19.05 12.04C17.05 12.49 10.62 13.2 9.86998 12.9C9.39998 12.7 8.86998 13.67 10.39 13.66C11.12 13.66 13.39 13.6 13.47 13.59C13.7 13.59 22.47 12.45 23.1 12.41C24.17 12.29 24 12.57 23.94 8.64004ZM4.89998 3.79004C4.2544 4.1938 3.58668 4.56104 2.89998 4.89004C2.98998 3.33004 2.99998 2.61004 3.08998 1.89004C3.23998 1.89004 3.56998 1.70004 3.94998 1.65004C4.77998 1.53004 5.94998 1.46004 7.39998 1.40004C6.72342 2.34602 5.87543 3.1567 4.89998 3.79004ZM22.31 3.69004C22 3.50004 20.75 3.22004 20.51 3.00004L19.72 2.23004L18.89 1.28004C22.54 1.34004 21.76 1.39004 22.54 1.50004C22.54 1.98004 22.63 2.86004 22.68 3.93004C22.5482 3.86392 22.4241 3.78344 22.31 3.69004ZM19.45 11.93C19.4809 11.8932 19.5025 11.8494 19.513 11.8024C19.5234 11.7554 19.5224 11.7066 19.51 11.66C19.08 9.00004 22.41 9.00004 22.9 8.71004C22.9 9.55004 22.98 11.38 22.98 11.55C22.15 11.63 20.33 11.79 19.45 11.93Z" fill="#006400" />
            <Path fillRule="evenodd" clipRule="evenodd" d="M11.47 5.92C11.47 6.24 11.78 6.54 11.92 6.71C12.56 7.48 13.78 7.5 14.51 7.89C14.98 8.13 15.26 7.89 14.51 8.23C13.89 8.5 12.37 8.88 12.22 8.23C12.2116 8.18593 12.1946 8.14396 12.1699 8.10649C12.1452 8.06903 12.1134 8.03682 12.0762 8.01173C12.039 7.98663 11.9972 7.96914 11.9533 7.96026C11.9093 7.95138 11.864 7.95129 11.82 7.96C11.27 8.07 11.49 9.31 13.05 9.39C12.87 9.74 13.21 10.67 13.56 10.67C13.91 10.67 14.29 9.77 14.02 9.33C14.3088 9.28897 14.5932 9.22204 14.87 9.13C15.44 8.95 15.87 8.75 16.01 8.19C16.15 7.63 15.64 7.19 15.08 6.86C14.52 6.53 13.08 6.3 12.77 5.94C12.72 5.94 12.63 5.7 12.55 5.7C12.75 5.07 14.55 4.82 14.66 5.12C14.6948 5.17044 14.7438 5.20943 14.8008 5.23204C14.8577 5.25464 14.9201 5.25985 14.9801 5.24701C15.04 5.23417 15.0948 5.20385 15.1375 5.15988C15.1802 5.11592 15.2089 5.06028 15.22 5C15.11 4.55 14.52 4.37 14.06 4.32C14.1534 4.07361 14.1507 3.80111 14.0526 3.55658C13.9544 3.31206 13.7679 3.11339 13.53 3C13.414 3.05757 13.3121 3.14004 13.2316 3.24152C13.1512 3.34301 13.0941 3.461 13.0645 3.58708C13.0349 3.71316 13.0335 3.84422 13.0603 3.97092C13.0872 4.09761 13.1417 4.2168 13.22 4.32C12.31 4.52 11.46 5 11.47 5.92Z" fill="#006400" />
        </G>
        <Defs>
            <ClipPath id="clip0_47_2">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
));
