def Mat(n):
    n=int(n)
    return [[1 for _ in range(n)] for _ in range(n)]


#Funciones de matrices dirigidas:
def MIncidenciaD(n:int, e:int, s:list, l:list):
    mat = [["0" for _ in range(e)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][x] = "+1"
        if mat[l[x]-1][x] == "+1":
            mat[l[x]-1][x] = "±1"
        else:
            mat[l[x]-1][x] = "-1"
    
    return mat

def MAdyacenciaD(n:int, e:int, s:list, l:list):
    mat = [[0 for _ in range(n)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][l[x]-1]=1
    return mat


#Funciones de matrices NO Dirigidas:
def MIncidenciaG(n:int, e:int, s:list, l:list):
    mat = [[0 for _ in range (e)] for _ in range(n)]
    
    for x in range(e):
        mat[s[x]-1][x]+=1 
        mat[l[x]-1][x]+=1 
    
    return mat

def MAdyacenciaG(n:int, e:int, s:list, l:list):
    mat = [[0 for _ in range(n)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][l[x]-1] = 1
        mat[l[x]-1][s[x]-1] = 1
    return mat