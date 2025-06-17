"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingModule = void 0;
const common_1 = require("@nestjs/common");
const banking_service_1 = require("./banking.service");
const banking_controller_1 = require("./banking.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let BankingModule = class BankingModule {
};
exports.BankingModule = BankingModule;
exports.BankingModule = BankingModule = __decorate([
    (0, common_1.Module)({
        providers: [banking_service_1.BankingService, prisma_service_1.PrismaService],
        controllers: [banking_controller_1.BankingController],
    })
], BankingModule);
//# sourceMappingURL=banking.module.js.map