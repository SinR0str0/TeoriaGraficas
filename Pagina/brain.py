def Mat(n):
    n=int(n)
    return [[1 for _ in range(n)] for _ in range(n)]


#Funciones de matrices dirigidas:
def MIncidenciaD(n:int, e:int, s:list, l:list):
    mat = [["0" for _ in range(e)] for _ in range(n)]
    for x in range(e):
        mat[s[x]-1][x] = "+1"
        if mat[l[x]-1][x] == "+1" or mat[l[x]-1][x]=="-1":
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

def MAccesibilidad(MAdya:list):
    n = len(MAdya)
    MatrizC=MAdya
    MatrizR=MAdya
    for _ in range(int((n**2+n+2)/2)):
        for i in range(n):
            for j in range(n):
                suma=0
                for k in range(n):
                    suma+=MatrizC[i][k]*MAdya[k][j]
                MatrizR[i][j]=MatrizR[i][j]+suma
    for i in range(n):
        for j in range(n):
            if MatrizR[i][j]!=0:
                MatrizR[i][j]="+"
    return MatrizR

def Paralelas(Mincide:list):
    paralelas=[[0] for _ in range(len(Mincide))]
    for i in range(len(Mincide)):
        for j in range(i,len(Mincide)):
            if Mincide[i]==Mincide[j]:
                paralelas[i].append(j+1)
    return paralelas

def Bucles(MIncide:list):
    n=len(MIncide)
    m = len(MIncide[0])
    arr = []
    for i in range(n):
        suma = 0
        for j in range(m):
            suma += MIncide[j][i]
        if suma==1:
            arr.append(i+1)
    return arr

def Series(MIncide:list, Grados:list):
    n = len(Grados)
    arr = [[0] for _ in range(n)]
    for i in range(n):
        if Grados[i]==2:
            for j in range(n):
                if MIncide[i][j]==1:
                    arr[i].append(j+1)
    return arr

print(MIncidenciaD(3,3,[1,2,3],[2,3,1]))
print(MAdyacenciaD(3,3,[1,2,3],[2,3,1]))
print(MIncidenciaG(3,3,[1,2,3],[2,3,1]))
print(MAdyacenciaG(3,3,[1,2,3],[2,3,1]))
incider = MIncidenciaG(3,3,[1,2,3],[2,3,1])
adya = MAdyacenciaG(3,3,[1,2,3],[2,3,1])

print(MAccesibilidad(adya))
print(Paralelas(incider))
print(Bucles(incider))
print(Series(incider,[2,2,2]))