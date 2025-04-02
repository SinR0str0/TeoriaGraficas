#Para gráficas dirigidas
#Cada si llega a li

n=6
e=5
Salen=[2,2,1,3,3]
Llegan=[1,1,4,3,5]

def MIncidenciaD(n,e,s,l):
    mat = [["0" for _ in range(e)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][x] = "+1"
        if mat[l[x]-1][x] == "+1":
            mat[l[x]-1][x] = "±1"
        else:
            mat[l[x]-1][x] = "-1"
    
    return mat

def MAdyacenciaD(n,e,s,l):
    mat = [[0 for _ in range(n)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][l[x]-1]=1
    return mat

def printM(mat):
    for x in mat:
        print(x)

#printM(MIncidenciaD(n,e,Salen,Llegan))
printM(MAdyacenciaD(n,e,Salen,Llegan))