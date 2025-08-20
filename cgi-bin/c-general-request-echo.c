#include "stdio.h"
#include "stdlib.h"

int main(int argc, char **argv, char **envp)
{
  char str[1000];
  // Print HTML header
  printf("Cache-Control: no-cache\n");
  printf("Content-type: text/html\n\n");
  printf("<html><head><title>General Request Echo</title></head> \
	<body><h1 align=center>General Request Echo</h1> \
  	<hr/>\n");
  printf("<p>Hello, my name is <strong>Xiaogneg Xu</strong></p>");


  // Get environment vars
  printf("<table>\n");
  printf("<tr><td>Protocol:</td><td>%s</td></tr>\n", getenv("SERVER_PROTOCOL"));
  printf("<tr><td>Method:</td><td>%s</td></tr>\n", getenv("REQUEST_METHOD"));

  printf("<table> Formatted Query String:");
  char *query = strdup(getenv("QUERY_STRING"));
  char *tokens = query;
  char *p = query;
  while ((p = strsep (&tokens, "&\n"))) {
        char *var = strtok (p, "="),
             *val = NULL;
        if (var && (val = strtok (NULL, "=")))
            printf ("<tr><td>%-8s:</td><td>%s</td></tr>\n", var, val);
        else
            fputs ("<empty field>\n", stderr);
    }
  free (query);

  printf("<tr><td>Message Body:</td><td> %s</td></tr>\n", fgets(str, 1000, stdin));


  printf("</table>");

  
  // Print HTML footer
  printf("</body>");
  printf("</html>");
  return 0;
}
