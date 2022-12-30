#include "application.hh"

Application::Application(int32_t width, int32_t height, const std::string& title)
{
    glfwInit();
    //glfwWindowHint(GLFW_DECORATED, GLFW_FALSE);
    m_Window = glfwCreateWindow(width, height, title.c_str(), nullptr, nullptr);
}

Application::~Application()
{

}

void Application::init()
{
    glfwMakeContextCurrent(m_Window);
    glfwSwapInterval(1);
    gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();

    ImGuiIO& io = ImGui::GetIO(); (void)io;
    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;

    ImGui_ImplGlfw_InitForOpenGL(m_Window, true);
    ImGui_ImplOpenGL3_Init();

    onInit();

    while (!glfwWindowShouldClose(m_Window))
    {
        onUpdate();

        glClearColor(0, 0, 0, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);


        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        
        onRender();

        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        glfwSwapBuffers(m_Window);
        glfwPollEvents();
    }

    onClose();
}
