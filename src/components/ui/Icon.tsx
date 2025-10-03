import React from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiClock,
  FiSearch,
  FiUser,
  FiBell,
  FiEye,
  FiGrid,
  FiTruck,
  FiBox,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiRefreshCw,
  FiInfo,
  FiFile,
  FiAlertTriangle,
  FiArrowRight,
} from "react-icons/fi";
import { FaTrain } from "react-icons/fa";

type IconName = "plus" | "edit" | "trash" | "chevDown" | "chevUp" | "check" | "clock" | "search" | "user" | "bell" | "eye" | "grid" | "truck" | "box" | "calendar";

// add logout and a few UI icons
export type ExtendedIconName = IconName | "logout" | "menu" | "x" | "swap" | "info" | "file" | "alert" | "arrowRight" | "train";

const ICON_MAP: Record<ExtendedIconName, React.ComponentType<any>> = {
  plus: FiPlus,
  edit: FiEdit,
  trash: FiTrash2,
  chevDown: FiChevronDown,
  chevUp: FiChevronUp,
  check: FiCheck,
  clock: FiClock,
  search: FiSearch,
  user: FiUser,
  bell: FiBell,
  eye: FiEye,
  grid: FiGrid,
  truck: FiTruck,
  box: FiBox,
  calendar: FiCalendar,
  logout: FiLogOut,
  menu: FiMenu,
  x: FiX,
  swap: FiRefreshCw,
  info: FiInfo,
  file: FiFile,
  alert: FiAlertTriangle,
  arrowRight: FiArrowRight,
  train: FaTrain,
};

export interface IconProps extends React.ComponentProps<"svg"> {
  name: ExtendedIconName;
  className?: string;
}

export default function Icon({ name, className, ...rest }: IconProps) {
  const C = ICON_MAP[name];
  return <C className={className} {...rest} />;
}
