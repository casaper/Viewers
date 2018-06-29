#!/bin/bash

## Colors for shell output
# Foreground colors
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[0;33m'
export BLUE='\033[0;34m'
export MAGENTA='\033[0;35m'
export CYAN='\033[0;36m'
export LIGHT_GRAY='\033[0;37m'
export DARK_GRAY='\033[0;90m'
export LIGHT_RED='\033[0;91m'
export LIGHT_GREEN='\033[0;92m'
export LIGHT_YELLOW='\033[0;93m'
export LIGHT_BLUE='\033[0;94m'
export LIGHT_MAGENTA='\033[0;95m'
export LIGHT_CYAN='\033[0;96m'

export DEFAULT_COLOR='\033[39m' # No Color

# Background colors
export BG_DEFAULT='\033[49m'
export BG_BLACK='\033[40m'
export BG_RED='\033[41m'
export BG_GREEN='\033[42m'
export BG_YELLOW='\033[43m'
export BG_BLUE='\033[44m'
export BG_MAGENTA='\033[45m'
export BG_CYAN='\033[46m'
export BG_LIGHT_GRAY='\033[47m'
export BG_DARK_GRAY='\033[100m'
export BG_LIGHT_RED='\033[101m'
export BG_LIGHT_GREEN='\033[102m'
export BG_LIGHT_YELLOW='\033[103m'
export BG_LIGHT_BLUE='\033[104m'
export BG_LIGHT_MAGENTA='\033[105m'
export BG_LIGHT_CYAN='\033[106m'
export BG_WHITE='\033[107m'

# Font style
export BOLD='\033[1m'
export BOLD_RE='\033[21m'
export DIM='\033[2m'
export DIM_RE='\033[22m'
export UNDERLINED='\033[4m'
export UNDERLINED_RE='\033[24m'
export BLINK='\033[5m'
export BLINK_RE='\033[25m'
export INVERT='\033[7m'
export INVERT_RE='\033[27m'
export INVERT_BOLD="${INVERT}${BOLD}"
export INVERT_BOLD_RE="${INVERT_RE}${BOLD_RE}"
export UNDERLINED_BOLD="${UNDERLINED}${BOLD}"
export UNDERLINED_BOLD_RE="${UNDERLINED_RE}${BOLD_RE}"

export NORMAL='\033[28m'

export RESET_FORMAT='\033[0m'
