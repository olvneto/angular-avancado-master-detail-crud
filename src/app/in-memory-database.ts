import { Category } from './pages/categories/shared/category.model';
import { InMemoryDbService } from "angular-in-memory-web-api";
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService{
    createDb(){
        const categories: Category[] = [
            {
                id: 1,
                name: "Moradia",
                description:"Pagamentos de contas da casa"
            },
            {
                id: 2,
                name: "Saúde",
                description:"Plano de saúde e remédios"
            },
            {
                id: 3,
                name: "Lazer",
                description:"Cinema, parques, praia, etc."
            },
            {
                id: 4,
                name: "Salário",
                description:"Recebimento de salário"
            },
            {
                id: 3,
                name: "Freelas",
                description:"Trabalhos como freelancer"
            }            
        ];
        const entries: Entry[] =[
          /*  {

            }*/
        ];
        return { categories, entries }
    }
}