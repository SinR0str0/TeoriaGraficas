#Para gráficas no dirigidas
#Cada si llega a li y viceversa
n=6
e=5
Salen=[1,2,1,3,3]
Llegan=[2,1,4,3,5]

def printM(mat):
    for x in mat:
        print(x)

def MIncidenciaG(n,e,s,l):
    mat = [[0 for _ in range (e)] for _ in range(n)]
    
    for x in range(e):
        mat[s[x]-1][x]++
        mat[l[x]-1][x]++
    
    return mat

def MAdyacenciaG(n,e,s,l):
    mat = [[0 for _ in range(n)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][l[x]-1] = 1
        mat[l[x]-1][s[x]-1] = 1
    return mat

#printM(MIncidenciaG(n,e,Salen,Llegan))
printM(MAdyacenciaG(n,e,Salen,Llegan))
