import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/korean/early-states/gojoseon-neighbors/gojoseon",
        destination: "/korean/prehistoric-early/gojoseon-neighbors/gojoseon-rise",
        permanent: true,
      },
      {
        source: "/korean/early-states/gojoseon-neighbors/northern-southern-polities",
        destination: "/korean/prehistoric-early/gojoseon-neighbors/buyeo-samhan-states",
        permanent: true,
      },
      {
        source: "/korean/goryeo/foundation-governance/goryeo-founding",
        destination: "/korean/goryeo/politics/goryeo-politics-overview",
        permanent: true,
      },
      {
        source: "/korean/prehistoric/prehistoric-culture/paleolithic",
        destination: "/korean/prehistoric-early/prehistoric-culture/paleolithic-life",
        permanent: true,
      },
      {
        source: "/korean/prehistoric/prehistoric-culture/neolithic",
        destination: "/korean/prehistoric-early/prehistoric-culture/neolithic-life",
        permanent: true,
      },
      {
        source: "/korean/prehistoric/prehistoric-culture/bronze-iron",
        destination: "/korean/prehistoric-early/prehistoric-culture/bronze-iron-culture",
        permanent: true,
      },
      {
        source: "/world/ancient-civilizations/river-civilizations/four-civilizations",
        destination: "/world/origins/world-history-meaning/meaning-of-world-history",
        permanent: true,
      },
      {
        source: "/world/contemporary/cold-war/cold-war",
        destination: "/world/contemporary-world/cold-war/cold-war-formation",
        permanent: true,
      },
      {
        source: "/world/east-asia/development/song-mongol",
        destination: "/world/east-asia/development/song-society",
        permanent: true,
      },
      {
        source: "/world/east-asia/early-modern/ming-qing-edo",
        destination: "/world/east-asia/transformation/ming",
        permanent: true,
      },
      {
        source: "/world/east-asia/formation/chinese-empire-foundations",
        destination: "/world/east-asia/formation/qin-unification",
        permanent: true,
      },
      {
        source: "/world/modern/imperialism/imperialism-nationalism",
        destination: "/world/imperialism-world-wars/imperialism-nationalism/imperialism-partition",
        permanent: true,
      },
      {
        source: "/world/prehistoric/origins/neolithic-revolution",
        destination: "/world/origins/prehistory/human-origins",
        permanent: true,
      },
      {
        source: "/world/west-asia/ottoman/ottoman-empire",
        destination: "/world/west-asia/gunpowder-empires/ottoman-empire",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
