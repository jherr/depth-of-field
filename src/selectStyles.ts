export type NativeSelectStyles = {
  bg: string;
  color: string;
  borderColor: string;
  iconColor: string;
  _hover: {
    bg: string;
    borderColor: string;
  };
  _focus: {
    bg: string;
    borderColor: string;
    boxShadow: string;
  };
  _active: {
    bg: string;
    borderColor: string;
  };
  sx: {
    colorScheme: "light" | "dark";
    "& > option": {
      background: string;
      color: string;
    };
  };
};

export function buildNativeSelectStyles(
  colorMode: "light" | "dark"
): NativeSelectStyles {
  if (colorMode === "dark") {
    return {
      bg: "gray.700",
      color: "whiteAlpha.900",
      borderColor: "whiteAlpha.300",
      iconColor: "whiteAlpha.700",
      _hover: {
        bg: "gray.700",
        borderColor: "whiteAlpha.400",
      },
      _focus: {
        bg: "gray.700",
        borderColor: "blue.300",
        boxShadow: "0 0 0 1px var(--chakra-colors-blue-300)",
      },
      _active: {
        bg: "gray.700",
        borderColor: "blue.300",
      },
      sx: {
        colorScheme: "dark",
        "& > option": {
          background: "var(--chakra-colors-gray-700)",
          color: "var(--chakra-colors-whiteAlpha-900)",
        },
      },
    };
  }

  return {
    bg: "white",
    color: "gray.800",
    borderColor: "gray.200",
    iconColor: "gray.500",
    _hover: {
      bg: "white",
      borderColor: "gray.300",
    },
    _focus: {
      bg: "white",
      borderColor: "blue.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
    },
    _active: {
      bg: "white",
      borderColor: "blue.500",
    },
    sx: {
      colorScheme: "light",
      "& > option": {
        background: "var(--chakra-colors-white)",
        color: "var(--chakra-colors-gray-800)",
      },
    },
  };
}
