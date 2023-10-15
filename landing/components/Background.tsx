export function Background() {
  return (
    <div className="max-w-5xl mx-auto relative">
      <svg
        className="transform-gpu -top-20 blur-[140px] absolute -z-10 rotate-[-80deg] h-[42rem]"
        viewBox="0 0 1155 678"
      >
        <path
          d="M317.219 518.975L203.852 678L0 438.341L317.219 518.975L521.391 232.573C522.698 364.91 566.474 579.231 731.124 377.821C936.936 126.058 882.053 -94.234 1031.02 41.331C1150.2 149.782 1161.7 336.668 1152.55 416.554L855 299L876.173 661.054L317.219 518.975Z"
          fill="url(#bg-gradient)"
        />
        <defs>
          <linearGradient
            id="bg-gradient"
            x1="71"
            y1="518"
            x2="1117"
            y2="190"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3F2758" />
            <stop offset="0.5" stopColor="#2D4686" />
            <stop offset="1" stopColor="#2FFFCD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
