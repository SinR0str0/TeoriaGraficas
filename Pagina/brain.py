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
    MatrizR=[[0 for _ in range(n)] for _ in range(n)]

    for _ in range(int((n**2+n+2)/2)):
        for i in range(n):
            for j in range(n):
                suma=0
                for k in range(n):
                    suma+=int(MatrizC[i][k])*int(MAdya[k][j])
                MatrizR[i][j]=int(MatrizR[i][j])+suma
    for i in range(n):
        for j in range(n):
            if MatrizR[i][j]!=0:
                MatrizR[i][j]="+"
    return MatrizR

def Paralelas(Mincide:list):
    paralelas=[[] for _ in range(len(Mincide))]
    for i in range(len(Mincide)):
        for j in range(i,len(Mincide)):
            if Mincide[i]==Mincide[j] and j!=i:
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
                if MIncide[i][j]>=1:
                    arr[i].append(j+1)
    return arr

def isSimple(MIncide:list):
    aParalelos = Paralelas(MIncide)
    aBucles = Bucles(MIncide)

    for x in aParalelos:
        if len(x)>0: return 0
    
    if len(aBucles)>0: return 0

    return 1

def isConnected(MAcceso:list):
    n=len(MAcceso)
    for i in range(n):
        for j in range(n):
            if MAcceso[i][j]!="+": return 0
    
    return 1

def Grado(MIncide:list, tipo):
    n = len(MIncide)
    m = len(MIncide[0])
    arr = []
    for i in range(n):
        suma = 0
        for j in range(m):
            if MIncide[i][j]>=tipo or ((tipo == "+1" or tipo=="-1") and MIncide[i][j]=="±1"):
                suma+=1
        arr.append(suma)
    
    return arr

def Aislado(GradoI:list, GradoE:list):
    n=len(GradoI)
    arr=[]
    for i in range(n):
        if (not GradoE and GradoI[i]==0) or (GradoI[i]==0 and GradoE[i]==0):
            arr.append(i+1)
        
    return arr

def Colgante(AGrados:int):
    n = len(AGrados)
    arr = []
    for i in range(n):
        if AGrados[i]==1:
            arr.append(i+1)
    return arr

def Iniciales(GradoI:list, GradoE:list):
    n = len(GradoI)
    arr = []
    for i in range(n):
        if GradoI[i]==0 and GradoE[i]!=0:
            arr.append(i+1)
    return arr

def Finales(GradoI:list, GradoE:list):
    n = len(GradoI)
    arr=[]
    for i in range(n):
        if GradoI[i]!=0 and GradoE[i]==0:
            arr.append(i+1)
    return arr

def isTree(n:int, e:int, MIncide:list):
    if e!=n-1: return 0

    if not Colgante(Grado(MIncide))>=2:
        return 0
    return 1

def isSimetric(MAdya:list):
    n = len(MAdya)
    for i in range(n):
        for j in range(n):
            if not MAdya[i][j]==MAdya[j][i]:
                return 0
    return 1

def isRegular(GradoI:list, GradoE:list):
    li = len(GradoI)
    le = len(GradoE)
    grado = GradoI[0]
    for i in range(li):
        if GradoI[i]!=grado:
            return 0
    
    for i in range(le):
        if GradoE[i]!=grado:
            return 0
    
    return 1

def isBalanced(GradoI:list, GradoE:list):
    n = len(GradoI)
    for i in range(n):
        if GradoI[i]!=GradoE[i]:
            return 0
    
    return 1

def isCompleted(GradoI:list, GradoE:list):
    li = len(GradoI)
    le = len(GradoE)
    grado = li-1
    for i in range(li):
        if GradoI[i]!=grado:
            return 0
    for i in range(le):
        if GradoE[i]!=grado:
            return 0
        
    return 1


def isEuleriana(tipo : int, MAcceso:list, MIncide:list):
    if tipo==1:
        #Gráfica
        if isConnected(MAcceso):
            vertices = Grado(MIncide,1)
            for x in vertices:
                if x%2!=0: return 0
        else: return 0
    else:
        #Digráfica
        gradoI = Grado(MIncide,"+1")
        gradoE = Grado(MIncide,"-1")

        if not (isBalanced(gradoI,gradoE) and isConnected(MAcceso)):
            return 0
    return 1

def isUnicursal(tipo : int, MAcceso:list, MIncide:list):
    if tipo==1:
        #Gráfica
        if isConnected(MAcceso):
            vertices = Grado(MIncide,1)
            impar = 0
            for x in vertices:
                if x%2!=0: impar+=1
            
            if impar != 2:
                return 0
        else: return 0
    else:
        #Digráfica
        impar = 0
        gradoI = Grado(MIncide,"+1")
        gradoE = Grado(MIncide,"-1")

        for x in range(len(gradoI)):
            if gradoI[x] != gradoE[x]:
                impar +=1
            
            if impar != 2:
                return 0
    return 1


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
