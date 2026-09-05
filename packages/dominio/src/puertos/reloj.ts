/** El tiempo entra por un puerto: así los casos de uso se pueden probar sin esperar. */
export interface PuertoReloj {
  ahora(): Date;
}
