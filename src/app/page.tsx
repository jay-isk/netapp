"use client";

import { useState } from "react";
import AdventCalendar from "@/components/advent-calendar";
import Image from "next/image";

export default function Home() {
  const [totalDays, setTotalDays] = useState<number>(12);

  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/6857743-min.jpg"
        alt="Purple bokeh background"
        fill
        className="object-cover object-center"
        data-ai-hint="purple bokeh"
        priority
      />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-7xl">
          <div className="text-left mb-2 px-4">
            <div className="mb-8" data-ai-hint="logo">
              <svg 
                width="130" 
                height="22" 
                xmlns="http://www.w3.org/2000/svg" 
                className="fill-white"
                viewBox="0 0 117 22"
                preserveAspectRatio="xMidYMid meet"
              >
                <g fill="#FFF" fillRule="evenodd">
                  <path d="M113.198 10.983v-.05c0-2.23-1.484-3.71-3.24-3.71-1.752 0-3.213 1.48-3.213 3.71v.05c0 2.233 1.461 3.714 3.213 3.714 1.756 0 3.24-1.456 3.24-3.714zm-10.16-6.745h3.758v1.93c.914-1.253 2.176-2.18 4.127-2.18 3.09 0 6.031 2.458 6.031 6.946v.05c0 4.49-2.891 6.947-6.03 6.947-2.004 0-3.24-.928-4.128-2.007v5.767h-3.759V4.238zM28.432.002h3.513l8.107 10.932V.002h3.758v17.68h-3.238l-8.38-11.163V17.68h-3.76zM54.98 9.906c-.22-1.707-1.21-2.86-2.79-2.86-1.56 0-2.574 1.133-2.87 2.86h5.66zm-9.343 1.129v-.052c0-3.836 2.695-6.994 6.553-6.994 4.423 0 6.45 3.485 6.45 7.297 0 .3-.023.653-.05 1.003h-9.221c.373 1.73 1.557 2.634 3.24 2.634 1.261 0 2.174-.402 3.213-1.38l2.149 1.93c-1.234 1.556-3.015 2.508-5.411 2.508-3.981 0-6.923-2.833-6.923-6.946zM60.986 13.866V7.497h-1.581v-3.26h1.581V.806h3.755v3.433h3.118v3.26h-3.118v5.743c0 .877.374 1.305 1.213 1.305.69 0 1.309-.175 1.855-.48v3.061c-.792.478-1.71.778-2.97.778-2.297 0-3.853-.928-3.853-4.039M97.749 10.983v-.05c0-2.23-1.484-3.71-3.237-3.71-1.755 0-3.213 1.48-3.213 3.71v.05c0 2.233 1.458 3.714 3.213 3.714 1.753 0 3.237-1.456 3.237-3.714zM87.592 4.238h3.756v1.93c.915-1.253 2.174-2.18 4.128-2.18 3.092 0 6.032 2.458 6.032 6.946v.05c0 4.49-2.892 6.947-6.032 6.947-2.001 0-3.24-.928-4.128-2.007v5.767h-3.756V4.238zM79.962 10.335l-2.298-5.697-2.3 5.697h4.598zM76 0h3.42l7.232 17.681h-3.967l-1.593-3.94h-6.86l-1.583 3.94h-3.88L76.001 0zM0 .002v17.68h8.133V7.073h4.648V17.68h8.133V.002z"></path>
                </g>
              </svg>
            </div>
            <div className="flex items-center justify-between -mt-[30px]">
              <h1 className="text-[70px] font-date uppercase text-primary-foreground tracking-wider font-normal">
                {totalDays} Days of Giving
              </h1>
              <div className="text-left text-[#e424ff] uppercase font-date text-[50px] tracking-wider -mt-[30px]">
                <h2>HAPPY</h2>
                <h2>HOLIDAYS</h2>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <AdventCalendar totalDays={totalDays} onTotalDaysChange={setTotalDays} />
          </div>
          <div className="flex items-center justify-between text-primary-foreground mt-4 px-4 text-xs">
            <p className="text-left">© 2025 NETAPP</p>
            <a 
              href="https://www.netapp.com/company/legal/cookie-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-right hover:underline"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
