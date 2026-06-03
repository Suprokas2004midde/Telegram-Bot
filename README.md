#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 9191
#define BUFFER_SIZE 800
#define SERVER_IP "172.16.5.10"

int main() {
    int server_fd, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t addr_size;
    char buffer[BUFFER_SIZE];

    // Create TCP socket
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    // Configure server address structure
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);
    server_addr.sin_addr.s_addr = inet_addr(SERVER_IP);

    // Bind the socket to the IP and Port
    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("Bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Listen for incoming connections
    if (listen(server_fd, 5) == 0) {
        printf("Server listening on %s:%d...\n", SERVER_IP, PORT);
    } else {
        perror("Error in listening");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Accept the client connection
    addr_size = sizeof(client_addr);
    client_socket = accept(server_fd, (struct sockaddr*)&client_addr, &addr_size);
    if (client_socket < 0) {
        perror("Accept failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Clear buffer and receive message from the client
    memset(buffer, 0, BUFFER_SIZE);
    recv(client_socket, buffer, BUFFER_SIZE, 0);
    printf("Received from TCS employee: %s\n", buffer);

    // Send the required response back to the client
    char *response = "TCS Secure Session Started";
    send(client_socket, response, strlen(response), 0);
    printf("Response sent to client.\n");

    // Close sockets
    close(client_socket);
    close(server_fd);
    
    return 0;
}
