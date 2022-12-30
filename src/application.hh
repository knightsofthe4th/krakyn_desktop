#ifndef _APPLICATION_HH_
#define _APPLICATION_HH_

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <stdint.h>
#include <string>

#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"

class Application
{
    protected:
        GLFWwindow* m_Window;

    public:
        Application(int32_t width, int32_t height, const std::string& title);
        virtual ~Application();

        void init();

        virtual void onInit()   = 0;
        virtual void onUpdate() = 0;
        virtual void onRender() = 0;
        virtual void onClose()  = 0;  
};

class MainWindow : public Application
{
    public:
        MainWindow(int32_t width, int32_t height, const std::string& title)
        : Application(width, height, title) {}

        ~MainWindow();

    protected:
        void onInit()   override;
        void onUpdate() override;
        void onRender() override;
        void onClose()  override;
};

#endif