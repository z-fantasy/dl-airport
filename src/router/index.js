import Vue from 'vue'
import Router from 'vue-router'

// const Login = () => import('../views/login')
import Login from '../views/login'
// const Register = () => import('../views/register')
import Register from '../views/register'
// const Home = () => import('../views/home')
import Home from '../views/home'

// home 下二级界面
import ImportantNotice from '../views/home/important-notice'
import RulesSystem from '../views/home/rules-system'
import QuestionInformation from '../views/home/question-information'
import TrainManagement from '../views/home/train-management'
import ComplaintsManagement from '../views/home/complaints-management'
import KnifeManagement from '../views/home/knife-management'
import StaffManagement from '../views/home/staff-management'
import StaffScheduling from '../views/home/staff-scheduling'
import StaffSign from '../views/home/staff-sign'
import PunishManagement from '../views/home/punish-management'
import PollingManagement from '../views/home/polling-management'
import Statement from '../views/home/statement'
import SurveyQuestion from '../views/home/survey-question'

// home下三级界面
import NoticeDetail from '../views/home/important-notice/notice-detail'
import RulesDetail from '../views/home/rules-system/rules-detail'
import StudyBank from '../views/home/question-information/study-bank'
import TrainingAppraisal from '../views/home/train-management/training-appraisal'
import TrainingCenterList from '../views/home/train-management/training-center-list'
import ComplaintContent from '../views/home/complaints-management/complaint-content'
import KnifeDetail from '../views/home/knife-management/knife-detail'
import StaffInfoDetail from '../views/home/staff-management/staff-info-detail'
import StaffSearch from '../views/home/staff-management/staff-search'
import StaffScheduleDetail from '../views/home/staff-scheduling/staff-schedule-detail'
import StatementDetail from '../views/home/statement/statement-detail'
import ChangePassword from '../views/home/staff-management/change-password/change-password'
import SurveyDetail from '../views/home/survey-question/survey-detail'
// home下四级界面
import StaffDetail from '../views/home/staff-management/staff-search/staff-detail'
import StudyDetail from '../views/home/question-information/study-bank/study-detail'
import ComplaintDeal from '../views/home/complaints-management/complaint-content/complaint-deal'
import TrainingCenterDetail from '../views/home/train-management/training-center-list/training-center-detail'

// 测试界面
import TestPage from '../views/test-page'
// 404
const PageNotFound = () => import('../views/page-not-found')
// import PageNotFound from '../views/page-not-found'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: '大连机场商户服务监督平台',
                requireAuth: true
            },
            children: [
                {
                    name: 'survey-question',
                    path: 'survey-question',
                    component: SurveyQuestion,
                    children: [
                        {
                            name: 'survey-detail',
                            path: 'survey-detail',
                            component: SurveyDetail,
                            meta: {
                                title: '问卷详情'
                            }
                        }
                    ],
                    meta: {
                        title: '问卷调查'
                    }
                },
                {
                    name: 'important-notice',
                    path: 'important-notice',
                    component: ImportantNotice,
                    children: [
                        {
                            name: 'notice-detail',
                            path: 'notice-detail',
                            component: NoticeDetail,
                            meta: {
                                title: '通知'
                            }
                        }
                    ],
                    meta: {
                        title: '重要通知'
                    }
                },
                {
                    name: 'rules-system',
                    path: 'rules-system',
                    component: RulesSystem,
                    children: [
                        {
                            name: 'rules-detail',
                            path: 'rules-detail',
                            component: RulesDetail,
                            meta: {
                                title: '大连机场巡检系统'
                            }
                        }
                    ],
                    meta: {
                        title: '规章制度'
                    }
                },
                {
                    name: 'question-information',
                    path: 'question-information',
                    component: QuestionInformation,
                    children: [
                        {
                            name: 'study-bank',
                            path: 'study-bank',
                            component: StudyBank,
                            meta: {
                                title: '资料'
                            },
                            children: [
                                {
                                    name: 'study-detail',
                                    path: 'study-detail',
                                    component: StudyDetail,
                                    meta: {
                                        title: '资料详情'
                                    }
                                }
                            ]
                        }
                    ],
                    meta: {
                        title: '题库资料'
                    }
                },
                {
                    name: 'train-management',
                    path: 'train-management',
                    component: TrainManagement,
                    children: [
                        {
                            name: 'training-appraisal',
                            path: 'training-appraisal',
                            component: TrainingAppraisal,
                            meta: {
                                title: '岗前培训考核'
                            }
                        },
                        {
                            name: 'training-center-list',
                            path: 'training-center-list',
                            component: TrainingCenterList,
                            children: [
                                {
                                    name: 'training-center-detail',
                                    path: 'training-center-detail',
                                    component: TrainingCenterDetail,
                                    meta: {
                                        title: '岗中培训考核详情'
                                    }
                                }
                            ],
                            meta: {
                                title: '岗中培训考核'
                            }
                        }
                    ],
                    meta: {
                        title: '培训管理'
                    }
                },
                {
                    name: 'complaints-management',
                    path: 'complaints-management',
                    component: ComplaintsManagement,
                    children: [
                        {
                            name: 'complaint-content',
                            path: 'complaint-content',
                            component: ComplaintContent,
                            meta: {
                                title: '投诉管理'
                            },
                            children: [
                                {
                                    name: 'complaint-deal',
                                    path: 'complaint-deal',
                                    component: ComplaintDeal,
                                    meta: {
                                        title: '改善处理'
                                    }
                                }
                            ]
                        }
                    ],
                    meta: {
                        title: '投诉管理'
                    }
                },
                {
                    name: 'knife-management',
                    path: 'knife-management',
                    component: KnifeManagement,
                    children: [
                        {
                            name: 'knife-detail',
                            path: 'knife-detail',
                            component: KnifeDetail,
                            meta: {
                                title: '刀具管理'
                            }
                        }
                    ],
                    meta: {
                        title: '刀具管理'
                    }
                },
                {
                    name: 'staff-management',
                    path: 'staff-management',
                    component: StaffManagement,
                    children: [
                        {
                            name: 'staff-info-detail',
                            path: 'staff-info-detail',
                            component: StaffInfoDetail,
                            meta: {
                                title: '员工信息'
                            }
                        },
                        {
                            name: 'staff-search',
                            path: 'staff-search',
                            component: StaffSearch,
                            children: [
                                {
                                    name: 'staff-detail',
                                    path: 'staff-detail',
                                    component: StaffDetail,
                                    meta: {
                                        title: '员工信息'
                                    }
                                }
                            ],
                            meta: {
                                title: '查找员工信息'
                            }
                        },
                        {
                            name: 'change-password',
                            path: 'change-password',
                            component: ChangePassword,
                            meta: {
                                title: '修改密码'
                            }
                        }
                    ],
                    meta: {
                        title: '员工管理'
                    }
                },
                {
                    name: 'staff-scheduling',
                    path: 'staff-scheduling',
                    component: StaffScheduling,
                    children: [
                        {
                            name: 'staff-schedule-detail',
                            path: 'staff-schedule-detail',
                            component: StaffScheduleDetail,
                            meta: {
                                title: '排班'
                            }
                        }
                    ],
                    meta: {
                        title: '员工排班'
                    }
                },
                {
                    name: 'staff-sign',
                    path: 'staff-sign',
                    component: StaffSign,
                    meta: {
                        title: '员工签到'
                    }
                },
                {
                    name: 'punish-management',
                    path: 'punish-management',
                    component: PunishManagement,
                    meta: {
                        title: '处罚管理'
                    }
                },
                {
                    name: 'polling-management',
                    path: 'polling-management',
                    component: PollingManagement,
                    meta: {
                        title: '巡检管理'
                    }
                },
                {
                    name: 'statement',
                    path: 'statement',
                    component: Statement,
                    children: [
                        {
                            name: 'statement-detail',
                            path: 'statement-detail',
                            component: StatementDetail,
                            meta: {
                                title: '报表详情'
                            }
                        }
                    ],
                    meta: {
                        title: '报表'
                    }
                }
            ]
        },
        {
            name: 'register',
            path: '/register',
            component: Register,
            meta: {
                title: '注册',
                requireAuth: false
            }
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
            meta: {
                title: '登录',
                requireAuth: false
            }
        },
        {
            name: 'test-page',
            path: 'test-page',
            component: TestPage,
            meta: {
                title: '测试页'
            }
        },
        {
            name: 'page-not-found',
            path: '*',
            component: PageNotFound,
            meta: {
                title: '404未找到页面',
                requireAuth: false
            }
        }
    ]
})
