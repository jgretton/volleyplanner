export function ServeReceiveDiagram() {
  return (
    <svg
      viewBox="0 0 400 500"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Court */}
      <rect x="20" y="20" width="360" height="460" fill="#F0F4F8" stroke="#94A3B8" strokeWidth="1.5" />
      {/* Net */}
      <line x1="20" y1="240" x2="380" y2="240" stroke="#0B1F3A" strokeWidth="2.5" />
      {/* Attack lines */}
      <line x1="20" y1="147" x2="380" y2="147" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6 4" />
      <line x1="20" y1="333" x2="380" y2="333" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6 4" />

      {/* Server — top of court */}
      <circle cx="200" cy="58" r="14" fill="#185FA5" />
      <text x="200" y="63" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">SV</text>

      {/* Ball trajectory (serve) */}
      <path d="M200 72 C185 155 155 210 118 362" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeDasharray="6 4" />
      <polygon points="113,357 123,360 116,368" fill="#185FA5" />

      {/* Receivers — W formation */}
      <circle cx="100" cy="422" r="14" fill="#D85A30" />
      <text x="100" y="427" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">P2</text>

      <circle cx="190" cy="388" r="14" fill="#D85A30" />
      <text x="190" y="393" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">P3</text>

      <circle cx="285" cy="422" r="14" fill="#D85A30" />
      <text x="285" y="427" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">P4</text>

      <circle cx="140" cy="358" r="14" fill="#D85A30" />
      <text x="140" y="363" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">P1</text>

      <circle cx="248" cy="358" r="14" fill="#D85A30" />
      <text x="248" y="363" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">P5</text>

      {/* Setter */}
      <circle cx="318" cy="272" r="14" fill="#16A34A" />
      <text x="318" y="277" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">S</text>

      {/* Pass direction — receiver to setter */}
      <path d="M118 348 Q200 305 304 272" fill="none" stroke="#D85A30" strokeWidth="1.5" />
      <polygon points="300,265 310,270 303,278" fill="#D85A30" />
    </svg>
  )
}
