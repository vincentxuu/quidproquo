#include <stdio.h>
#include <stdlib.h>

int g_counter = 42;                 /* 全域變數 */

void inner(void) {
    int in_local = 3;
    printf("inner : in_local 在 %p\n", (void *)&in_local);
    printf("inner : 返回位址   %p\n", __builtin_return_address(0));
}

void outer(void) {
    int out_local = 2;
    printf("outer : out_local 在 %p\n", (void *)&out_local);
    printf("outer : 返回位址   %p\n", __builtin_return_address(0));
    inner();
    printf("outer : inner() 回來了，繼續往下\n");
}

int main(void) {
    int main_local = 1;
    int *on_heap = malloc(sizeof(int));
    *on_heap = 99;

    printf("main  : 函式 main  住在 %p\n", (void *)main);
    printf("main  : 函式 outer 住在 %p\n", (void *)outer);
    printf("main  : 函式 inner 住在 %p\n", (void *)inner);
    printf("main  : 全域 g_counter 在 %p\n", (void *)&g_counter);
    printf("main  : main_local 在 %p\n", (void *)&main_local);
    printf("main  : malloc 拿到 %p\n", (void *)on_heap);
    outer();
    printf("main  : outer() 回來了\n");
    free(on_heap);
    return 0;
}
