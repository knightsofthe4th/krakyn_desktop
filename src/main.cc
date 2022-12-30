#include "application.hh"

int main()
{
    MainWindow *mainWindow = new MainWindow(800, 600, "Krakyn Desktop");
    mainWindow->init();
    delete mainWindow;
    return 0;
}