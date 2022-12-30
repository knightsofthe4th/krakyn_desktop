cmake_minimum_required(VERSION 3.12)
project(krakyn_desktop)

set (SOURCES 
    "src/main.cc"
    "src/application.cc"
    "src/main_window.cc"
    
    "vendor/glad/src/glad.c"
    
    "vendor/imgui/backends/imgui_impl_glfw.cpp"
    "vendor/imgui/backends/imgui_impl_opengl3.cpp"
    "vendor/imgui/imgui.cpp"
    "vendor/imgui/imgui_demo.cpp"
    "vendor/imgui/imgui_draw.cpp"
    "vendor/imgui/imgui_tables.cpp"
    "vendor/imgui/imgui_widgets.cpp"
    )


set (INCLUDES  
    "vendor/glad/include"
    "vendor/glfw/include"
    "vendor/imgui/backends"
    "vendor/imgui"
    )

add_executable(krakyn_desktop ${SOURCES})
target_link_libraries(krakyn_desktop glfw)
target_include_directories(krakyn_desktop PRIVATE ${INCLUDES})

add_subdirectory(vendor/glfw)