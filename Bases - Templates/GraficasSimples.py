def sort(numeros, op=0):
    if not all(isinstance(i,(int,float)) for i in numeros):
        raise ValueError("La lista no es de números.")
        
    if op not in [0,1]:
        raise ValueError("Seleccione op 0 para ordenar de mayor a menor o 1 para ordenar de menor a mayor.")
        
    if len(numeros) <= 1:
            return numeros
    
    pivote = numeros[-1]
    
    menores = [x for x in numeros[:-1] if x <= pivote]
    mayores = [x for x in numeros[:-1] if x > pivote]
        
    if op == 0:
        #Ordenar de mayor a menor.
        return sort(mayores) + [pivote] + sort(menores)

    else:
        #Ordenar de menor a mayor.
        return sort(menores) + [pivote] + sort(mayores)


def hakimi(conjunto):
    conjunto2=[]
    conjunto=sort(conjunto)
    xi = conjunto[0]
    di = len(conjunto)-xi-1
    if di<0:
        #print(di," = ", len(conjunto),"-",xi,"-1")
        return -1
        
    
    for x in conjunto[1:xi+1]:
        x-=1
        conjunto2.insert(1,x)
        if x<0:
            return 0
    for x in conjunto[xi+1:]:
        conjunto2.insert(1,x)
        
    suma = sum(conjunto2)
    if suma == 0:
        return 1
    elif suma<0:
        return 0
    else:
        print("Comprobando: ",sort(conjunto2))
        return hakimi(conjunto2)
    
while(True):
    try:
        entrada = input().replace(","," ").replace("  ", " ").split(" ")
        conjunto = [int(x) for x in entrada]
        break
    except:
        print("Por favor escriba una cadena de números enteros válida.")
        continue

counter = 0
for x in conjunto:
    if x%2!=0:
        counter+=1
if counter%2==0:
    suma = sum(conjunto)
    if suma%2!=0:
        print("El conjunto no cumple con el teorema del estrechón de mano.")
    else:
        resultado = hakimi(conjunto)
        if resultado==1:
            print("La sucesión de números: ",conjunto," SI puede ser representada como una gráfica simple.")
        elif resultado==-1:
            print("La sucesión ",conjunto," no tiene suficientes elementos para ser considerada.")
        else:
            print("La sucesión no puede ser una gráfica simple pues el teorema no se cumple.")
else:
    print("El conjunto de datos no se puede expresar como una gráfica simple, pues existe un número impar de vértices de grado impar.")