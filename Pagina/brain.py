def Mat(n, relaciones):
    # Crear una matriz cuadrada de tamaño n x n inicializada con ceros
    matriz = [[0 for _ in range(n)] for _ in range(n)]
    
    # Parsear relaciones (espera una lista de pares [i,j])
    for i, j in relaciones:
        # Ajustar índices para que sean 0-based
        matriz[i-1][j-1] = 1
        matriz[j-1][i-1] = 1  # Asumimos un grafo no dirigido
    
    return [[1,2,3],[4,5,6]]