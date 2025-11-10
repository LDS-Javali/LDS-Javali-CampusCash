package route

import (
	"campuscash-backend/internal/controller"
	"campuscash-backend/internal/middleware"
	"campuscash-backend/internal/repository"
	"campuscash-backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	studentRepo := repository.NewStudentRepository(db)
	profRepo := repository.NewProfessorRepository(db)
	rewardRepo := repository.NewRewardRepository(db)
	couponRepo := repository.NewCouponRepository(db)
	companyRepo := repository.NewCompanyRepository(db)
	notificationRepo := repository.NewNotificationRepository(db)

	studentSvc := service.NewStudentService(studentRepo, db)
	profSvc := service.NewProfessorService(profRepo, studentRepo, db)
	rewardSvc := service.NewRewardService(rewardRepo)
	couponSvc := service.NewCouponService(couponRepo)
	companySvc := service.NewCompanyService(companyRepo)
	imgSvc := service.NewImageService()
	notificationSvc := service.NewNotificationService(notificationRepo)
	cronSvc := service.NewCronService(db, notificationSvc)

	r.POST("/api/auth/login", controller.Login(db))
	r.POST("/api/auth/signup/student", controller.SignupAluno(db))
	r.POST("/api/auth/signup/company", controller.SignupCompany(db))
	r.GET("/api/auth/me", middleware.Auth(), controller.GetMe(db))


	r.GET("/api/institutions", controller.ListInstitutions(db))
	r.GET("/api/rewards", controller.ListRewards(db))
	r.GET("/api/rewards/:id", controller.GetRewardById(db))


	student := r.Group("/api/student", middleware.Auth("student"))
	{
		student.GET("/profile", controller.StudentProfile(studentSvc))
		student.PUT("/profile", controller.UpdateStudentProfile(studentSvc))
		student.POST("/profile/avatar", controller.UploadStudentAvatar(db, imgSvc))
		student.GET("/balance", controller.StudentBalance(studentSvc))
		student.GET("/statistics", controller.StudentStatistics(studentSvc))


		student.GET("/transactions", controller.StudentTransactions(db))




		student.POST("/redeem", controller.StudentRedeem(db, notificationSvc))

		student.GET("/coupons", controller.StudentCoupons(couponSvc, db))
		student.GET("/notifications", controller.ListNotifications(notificationSvc))
		student.PATCH("/notifications/read-all", controller.MarkAllNotificationsAsRead(notificationSvc))
		student.PATCH("/notifications/:id/read", controller.MarkNotificationAsRead(notificationSvc))
		student.GET("/notifications/unread/count", controller.CountUnreadNotifications(notificationSvc))
	}


	professor := r.Group("/api/professor", middleware.Auth("professor"))
	{
		professor.GET("/profile", controller.ProfessorProfile(profSvc))
		professor.PUT("/profile", controller.UpdateProfessorProfile(profSvc))
		professor.GET("/balance", controller.ProfessorBalance(profSvc))
		professor.GET("/statistics", controller.ProfessorStatistics(profSvc))

		professor.GET("/transactions", controller.ProfessorTransactions(db))

		professor.GET("/students", controller.ProfessorStudents(profSvc))
		professor.GET("/students/search", controller.SearchStudents(studentSvc))
		professor.POST("/give-coins", controller.GiveCoins(db, notificationSvc))
		professor.GET("/notifications", controller.ListNotifications(notificationSvc))
		professor.PATCH("/notifications/read-all", controller.MarkAllNotificationsAsRead(notificationSvc))
		professor.PATCH("/notifications/:id/read", controller.MarkNotificationAsRead(notificationSvc))
		professor.GET("/notifications/unread/count", controller.CountUnreadNotifications(notificationSvc))
	}


	company := r.Group("/api/company", middleware.Auth("company"))
	{
		company.GET("/profile", controller.CompanyProfile(companySvc))
		company.PUT("/profile", controller.UpdateCompanyProfile(companySvc))
		company.POST("/profile/logo", controller.UploadCompanyLogo(db, imgSvc))
		company.GET("/statistics", controller.CompanyStatistics(companySvc, db))
		company.GET("/validations", controller.CompanyValidations(companySvc))
		company.GET("/rewards", controller.CompanyRewards(rewardSvc, db))
		company.POST("/rewards", controller.CompanyCreateReward(rewardSvc))
		company.POST("/rewards/:id/image", controller.UploadRewardImage(db, imgSvc))
		company.PATCH("/rewards/:id", controller.CompanyUpdateReward(db))
		company.PATCH("/rewards/:id/status", controller.CompanyUpdateRewardStatus(db))
		company.DELETE("/rewards/:id", controller.CompanyDeleteReward(db))

		company.GET("/history", controller.CompanyHistory(db))

		company.POST("/validate-coupon", controller.CompanyValidateCoupon(couponSvc, db))
		company.GET("/coupon/:hash", controller.GetCouponByHash(couponSvc, db))
	}


	r.GET("/api/images/:type/:id", controller.GetImage(db))


	r.POST("/api/internal/cron/distribute-coins", controller.DistributeCoins(cronSvc))





	cronSvc.StartCronJob()

	r.GET("/", func(c *gin.Context) { c.String(200, "CampusCash Backend is running") })
}
