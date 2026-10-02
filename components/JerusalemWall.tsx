// The seam under the hero: the Old City wall seen from outside Jaffa Gate.
// Suleiman's crenellated wall runs the full width, with the gate tower on the left
// and the Tower of David (the citadel and its minaret) on the right. It is filled
// with the colour of the section below, so the page itself becomes the wall and the
// film plays in the sky above it.
const WALL_TOP = 84; // y of the wall walk; merlons rise 12px above it
const H = 120;

const merlon = (x: number, y: number) => `M${x} ${y} v-11 l2 -1 h18 l2 1 v11 z`;

export default function JerusalemWall({ className = "" }: { className?: string }) {
  const fill = "var(--color-meleke)";
  const joint = "rgba(27, 22, 18, 0.11)";

  return (
    <svg className={`pointer-events-none block w-full ${className}`} height={H} aria-hidden>
      <defs>
        <pattern id="jw-merlons" width="36" height={H} patternUnits="userSpaceOnUse">
          <path d={merlon(0, WALL_TOP)} fill={fill} />
        </pattern>
        {/* Ashlar courses: long limestone blocks, joints staggered course to course */}
        <pattern id="jw-courses" width="104" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 0.5 H104 M0 12.5 H104 M34 0 V12 M86 12 V24" stroke={joint} fill="none" />
        </pattern>
      </defs>

      {/* Curtain wall */}
      <rect width="100%" height={H} fill="url(#jw-merlons)" />
      <rect y={WALL_TOP} width="100%" height={H - WALL_TOP} fill={fill} />
      <rect y={WALL_TOP + 8} width="100%" height={H - WALL_TOP - 8} fill="url(#jw-courses)" />

      {/* Gate tower */}
      <svg x="10%" width="96" height={H} overflow="visible">
        <path d={`M0 ${H} V50 H96 V${H} Z`} fill={fill} />
        <path d={`${merlon(1, 50)} ${merlon(37, 50)} ${merlon(73, 50)}`} fill={fill} />
        <path d={`M34 ${H} V86 Q34 70 48 64 Q62 70 62 86 V${H}`} fill="none" stroke={joint} strokeWidth="1.5" />
        <path d="M18 66 v12 M78 66 v12" stroke={joint} strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Tower of David */}
      <svg x="58%" width="132" height={H} overflow="visible">
        <path d={`M0 ${H} V58 H132 V${H} Z`} fill={fill} />
        <path d={`${merlon(1, 58)} ${merlon(37, 58)} ${merlon(73, 58)} ${merlon(109, 58)}`} fill={fill} />
        {/* Minaret: shaft, balcony, lantern, cap */}
        <path d="M86 58 V30 H100 V58 Z" fill={fill} />
        <path d="M82 30 h22 v-4 h-22 z" fill={fill} />
        <path d="M89 26 V15 H97 V26 Z" fill={fill} />
        <path d="M88 15 Q93 3 98 15 Z" fill={fill} />
        <path d="M93 6 V1" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 76 v12 M56 76 v12" stroke={joint} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </svg>
  );
}
