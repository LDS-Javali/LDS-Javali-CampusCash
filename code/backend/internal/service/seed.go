package service

import (
	"campuscash-backend/internal/model"
	"math/rand"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedInstituicoes(db *gorm.DB) {
	institutions := []model.Institution{
		{Name: "PUC Minas"},
		{Name: "UFMG"},
		{Name: "UFV"},
		{Name: "UFJF"},
		{Name: "UFSJ"},
		{Name: "UNIFEI"},
		{Name: "Cefet-MG"},
		{Name: "IFMG"},
		{Name: "FUMEC"},
		{Name: "PUC-Rio"},
		{Name: "UFRJ"},
		{Name: "USP"},
		{Name: "UNICAMP"},
		{Name: "UFSCar"},
		{Name: "UNESP"},
	}
	
	for _, inst := range institutions {
		db.FirstOrCreate(&inst)
	}
}

func SeedProfessores(db *gorm.DB) {
	professors := []struct {
		Name     string
		Email    string
		Password string
		Balance  uint
	}{
		{"Dr. Ana Silva", "ana.silva@demo.com", "prof123", 2500},
		{"Prof. Carlos Santos", "carlos.santos@demo.com", "prof123", 1800},
		{"Dra. Maria Oliveira", "maria.oliveira@demo.com", "prof123", 3200},
		{"Prof. João Costa", "joao.costa@demo.com", "prof123", 1500},
		{"Dra. Fernanda Lima", "fernanda.lima@demo.com", "prof123", 2800},
		{"Prof. Roberto Alves", "roberto.alves@demo.com", "prof123", 2100},
		{"Dra. Patricia Souza", "patricia.souza@demo.com", "prof123", 1900},
		{"Prof. Marcos Ferreira", "marcos.ferreira@demo.com", "prof123", 2400},
		{"Dra. Juliana Rocha", "juliana.rocha@demo.com", "prof123", 1700},
		{"Prof. Antonio Pereira", "antonio.pereira@demo.com", "prof123", 2600},
	}
	
	for _, prof := range professors {
		hash, _ := bcrypt.GenerateFromPassword([]byte(prof.Password), bcrypt.DefaultCost)
		db.FirstOrCreate(&model.User{
			Name:         prof.Name,
			Email:        prof.Email,
			Role:         model.ProfessorRole,
			PasswordHash: string(hash),
			Balance:      prof.Balance,
		})
	}
}

func SeedAlunos(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())
	
	// Buscar instituições para associar aos alunos
	var institutions []model.Institution
	db.Find(&institutions)
	
	students := []struct {
		Name         string
		Email        string
		CPF          string
		Registration string
		Institution  string
		Course       string
		Balance      uint
	}{
		{"Lucas Mendes", "lucas.mendes@demo.com", "12345678901", "2024001", "PUC Minas", "Engenharia de Software", 450},
		{"Mariana Costa", "mariana.costa@demo.com", "12345678902", "2024002", "UFMG", "Ciência da Computação", 320},
		{"Pedro Silva", "pedro.silva@demo.com", "12345678903", "2024003", "PUC Minas", "Sistemas de Informação", 280},
		{"Ana Beatriz", "ana.beatriz@demo.com", "12345678904", "2024004", "UFV", "Engenharia Civil", 380},
		{"Rafael Santos", "rafael.santos@demo.com", "12345678905", "2024005", "UFJF", "Medicina", 520},
		{"Camila Oliveira", "camila.oliveira@demo.com", "12345678906", "2024006", "UFSJ", "Psicologia", 290},
		{"Gabriel Lima", "gabriel.lima@demo.com", "12345678907", "2024007", "UNIFEI", "Engenharia Elétrica", 410},
		{"Isabella Rocha", "isabella.rocha@demo.com", "12345678908", "2024008", "Cefet-MG", "Administração", 350},
		{"Felipe Alves", "felipe.alves@demo.com", "12345678909", "2024009", "IFMG", "Engenharia Mecânica", 480},
		{"Larissa Souza", "larissa.souza@demo.com", "12345678910", "2024010", "FUMEC", "Direito", 310},
		{"Bruno Pereira", "bruno.pereira@demo.com", "12345678911", "2024011", "PUC-Rio", "Economia", 420},
		{"Beatriz Ferreira", "beatriz.ferreira@demo.com", "12345678912", "2024012", "UFRJ", "Arquitetura", 360},
		{"Thiago Costa", "thiago.costa@demo.com", "12345678913", "2024013", "USP", "Física", 390},
		{"Amanda Silva", "amanda.silva@demo.com", "12345678914", "2024014", "UNICAMP", "Química", 440},
		{"Diego Oliveira", "diego.oliveira@demo.com", "12345678915", "2024015", "UFSCar", "Matemática", 270},
		{"Natália Santos", "natalia.santos@demo.com", "12345678916", "2024016", "UNESP", "Biologia", 330},
		{"Vinicius Lima", "vinicius.lima@demo.com", "12345678917", "2024017", "PUC Minas", "Engenharia de Produção", 400},
		{"Carolina Rocha", "carolina.rocha@demo.com", "12345678918", "2024018", "UFMG", "Letras", 250},
		{"Henrique Alves", "henrique.alves@demo.com", "12345678919", "2024019", "UFV", "Agronomia", 380},
		{"Juliana Souza", "juliana.souza@demo.com", "12345678920", "2024020", "UFJF", "Enfermagem", 420},
	}
	
	for _, student := range students {
		hash, _ := bcrypt.GenerateFromPassword([]byte("aluno123"), bcrypt.DefaultCost)
		
		// Escolher instituição aleatória
		var selectedInstitution string
		if len(institutions) > 0 {
			selectedInstitution = institutions[rand.Intn(len(institutions))].Name
		} else {
			selectedInstitution = student.Institution
		}
		
		db.FirstOrCreate(&model.User{
			Name:         student.Name,
			Email:        student.Email,
			CPF:          &student.CPF,
			Role:         model.StudentRole,
			PasswordHash: string(hash),
			Registration: &student.Registration,
			Institution:  &selectedInstitution,
			Course:       &student.Course,
			Balance:      student.Balance,
		})
	}
}

func SeedEmpresas(db *gorm.DB) {
	companies := []struct {
		Name        string
		Email       string
		CNPJ        string
		Description string
		Balance     uint
	}{
		{"TechCorp Solutions", "contato@techcorp.com", "12345678000101", "Soluções em tecnologia e desenvolvimento de software", 0},
		{"EduTech Inovação", "contato@edutech.com", "12345678000102", "Plataformas educacionais e ferramentas de aprendizado", 0},
		{"GreenEnergy Brasil", "contato@greenenergy.com", "12345678000103", "Energias renováveis e sustentabilidade", 0},
		{"HealthCare Plus", "contato@healthcare.com", "12345678000104", "Serviços de saúde e bem-estar", 0},
		{"FinanceFlow", "contato@financeflow.com", "12345678000105", "Soluções financeiras e investimentos", 0},
		{"FoodTech Delivery", "contato@foodtech.com", "12345678000106", "Delivery de comida e serviços gastronômicos", 0},
		{"FashionStyle", "contato@fashionstyle.com", "12345678000107", "Moda e acessórios para jovens", 0},
		{"SportsWorld", "contato@sportsworld.com", "12345678000108", "Equipamentos esportivos e fitness", 0},
		{"BookStore Online", "contato@bookstore.com", "12345678000109", "Livros e materiais educacionais", 0},
		{"GamingZone", "contato@gamingzone.com", "12345678000110", "Jogos e entretenimento digital", 0},
	}
	
	for _, company := range companies {
		hash, _ := bcrypt.GenerateFromPassword([]byte("empresa123"), bcrypt.DefaultCost)
    db.FirstOrCreate(&model.User{
			Name:         company.Name,
			Email:        company.Email,
			CPF:          &company.CNPJ,
			Role:         model.CompanyRole,
        PasswordHash: string(hash),
			CompanyName:  &company.Name,
			Balance:      company.Balance,
		})
	}
}

func SeedRecompensas(db *gorm.DB) {
	// Buscar empresas para associar às recompensas
	var companies []model.User
	db.Where("role = ?", model.CompanyRole).Find(&companies)
	
	if len(companies) == 0 {
		return
	}
	
	rewards := []struct {
		Title       string
		Description string
		Cost        uint
		Category    string
		Active      bool
	}{
		{"Desconto 20% em Cursos Online", "Desconto especial em qualquer curso da plataforma EduTech", 50, "Educação", true},
		{"Vale-compras R$ 30 - TechCorp", "Vale-compras para produtos de tecnologia", 40, "Tecnologia", true},
		{"Almoço grátis - FoodTech", "Almoço completo em qualquer restaurante parceiro", 25, "Alimentação", true},
		{"Livro grátis - BookStore", "Escolha qualquer livro da nossa seleção", 35, "Educação", true},
		{"Desconto 15% - FashionStyle", "Desconto em roupas e acessórios", 30, "Moda", true},
		{"Aula de Yoga - HealthCare", "Aula experimental de yoga online", 20, "Saúde", true},
		{"Jogo grátis - GamingZone", "Escolha qualquer jogo digital", 60, "Entretenimento", true},
		{"Consulta nutricional - HealthCare", "Consulta online com nutricionista", 45, "Saúde", true},
		{"Desconto 25% - SportsWorld", "Desconto em equipamentos esportivos", 55, "Esportes", true},
		{"Curso de idiomas - EduTech", "3 meses de curso de inglês online", 80, "Educação", true},
		{"Vale-compras R$ 50 - TechCorp", "Vale-compras para produtos premium", 70, "Tecnologia", true},
		{"Jantar romântico - FoodTech", "Jantar para 2 pessoas em restaurante especial", 40, "Alimentação", true},
		{"Roupa grátis - FashionStyle", "Escolha qualquer peça da coleção atual", 50, "Moda", true},
		{"Personal trainer - HealthCare", "Sessão online com personal trainer", 35, "Saúde", true},
		{"Console de videogame - GamingZone", "Desconto de 30% em consoles", 100, "Entretenimento", true},
		{"Livros técnicos - BookStore", "Kit com 3 livros técnicos", 45, "Educação", true},
		{"Equipamento fitness - SportsWorld", "Kit básico de exercícios em casa", 65, "Esportes", true},
		{"Curso de programação - EduTech", "Curso completo de Python", 90, "Educação", true},
		{"Smartphone - TechCorp", "Desconto de 20% em smartphones", 120, "Tecnologia", true},
		{"Spa day - HealthCare", "Tratamento completo de relaxamento", 75, "Saúde", true},
	}
	
	for i, reward := range rewards {
		companyID := companies[i%len(companies)].ID
		db.FirstOrCreate(&model.Reward{
			Title:       reward.Title,
			Description: reward.Description,
			Cost:        reward.Cost,
			Category:    reward.Category,
			Active:      reward.Active,
			CompanyID:   companyID,
		})
	}
}

func SeedTransacoes(db *gorm.DB) {
	// Buscar usuários para criar transações
	var students []model.User
	var professors []model.User
	
	db.Where("role = ?", model.StudentRole).Find(&students)
	db.Where("role = ?", model.ProfessorRole).Find(&professors)
	
	if len(students) == 0 || len(professors) == 0 {
		return
	}
	
	rand.Seed(time.Now().UnixNano())
	
	for i := 0; i < 50; i++ {
		student := students[rand.Intn(len(students))]
		professor := professors[rand.Intn(len(professors))]
		
		amount := uint(rand.Intn(100) + 10) // Entre 10 e 110 moedas
		
		// Criar transação de distribuição de moedas
		db.Create(&model.Transaction{
			FromUserID: &professor.ID,
			ToUserID:   &student.ID,
			Amount:     amount,
			Message:    "Moedas distribuídas por bom desempenho acadêmico",
			Type:       model.GiveCoins,
			CreatedAt:  time.Now().AddDate(0, 0, -rand.Intn(30)), // Últimos 30 dias
		})
	}
}

func SeedAll(db *gorm.DB) {
	SeedInstituicoes(db)
	SeedProfessores(db)
	SeedAlunos(db)
	SeedEmpresas(db)
	SeedRecompensas(db)
	SeedTransacoes(db)
}


