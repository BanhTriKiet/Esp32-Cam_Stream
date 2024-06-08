# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "C:/Users/tungu/esp/v4.4.7/esp-idf/components/bootloader/subproject"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix/tmp"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix/src/bootloader-stamp"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix/src"
  "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix/src/bootloader-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "D:/TKHTN/Esp32-Cam_Stream/Esp32Cam/build/bootloader-prefix/src/bootloader-stamp/${subDir}")
endforeach()
