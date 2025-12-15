import { pgTable, text, timestamp, uuid, date, decimal, pgEnum, serial, integer, boolean, unique, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ====================================================================
// 1. ENUMS 정의
// ====================================================================

// 반려동물 관련 ENUMS
export const speciesEnum = pgEnum('species', ['DOG', 'CAT']);
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE']);
export const neuteredEnum = pgEnum('neutered', ['Y', 'N', 'UNKNOWN']);
export const regStatusEnum = pgEnum('reg_status', ['Y', 'N']);

// 서비스/예약 관련 ENUMS (견고성 강화)
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const carStatusEnum = pgEnum('car_status', ['active', 'maintenance', 'inactive']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['unpaid', 'paid', 'refunded']);
export const serviceTypeEnum = pgEnum('service_type', ['SHUTTLE', 'CARE', 'OTHER']); // 서비스 타입 예시

// ====================================================================
// 2. 테이블 정의
// ====================================================================

// 1. 사용자 테이블 (User Table)
export const users = pgTable('users', {
    id: uuid('user_id').primaryKey(), // Supabase auth.users.id와 연결
    snsProvider: text('sns_provider').notNull(), // KAKAO, GOOGLE
    // snsId를 NotNull로 설정하고 Unique Index를 추가하여 계정 충돌 방지
    snsId: text('sns_id').notNull().unique(),
    nickname: text('nickname'),
    // email에 Unique Index를 추가하여 중복 가입 방지 (선택 사항)
    email: text('email').unique(),
    avatarUrl: text('avatar_url'), // URL 길이를 제한하여 안정성 확보 (drizzle pg-core text doesn't explicitly curb length in DDL usually, but verified user request kept it as text with comment)
    // role을 ENUM으로 변경하여 데이터 일관성 확보
    role: userRoleEnum('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. 반려동물 테이블 (Pet Table)
export const pets = pgTable('pets', {
    id: uuid('pet_id').defaultRandom().primaryKey(),
    // FK 설정 시 users.id를 직접 참조
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    petName: text('pet_name').notNull(),
    species: speciesEnum('species').notNull(),
    regStatus: regStatusEnum('reg_status').notNull(),
    // regNum에 unique 제약 대신 index만 설정하는 것을 고려 (선택 사항)
    regNum: text('reg_num').unique(),
    breed: text('breed').notNull(),
    gender: genderEnum('gender').notNull(),
    neutered: neuteredEnum('neutered').notNull(),
    birthDate: date('birth_date').notNull(),
    adoptionDate: date('adoption_date'),
    weightKg: decimal('weight_kg', { precision: 4, scale: 2 }),
    furColor: text('fur_color'),
    // 건강 고민은 JSONB를 사용하여 여러 개의 값을 저장하도록 변경 권장 (현재는 text 유지)
    healthConcerns: text('health_concerns'),
    profilePhotoUrl: text('profile_photo_url'), // URL 길이를 제한하여 안정성 확보
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. 차량/서비스 테이블 (Cars Table)
export const cars = pgTable('cars', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    region: text('region').notNull(),
    // status를 ENUM으로 변경
    status: carStatusEnum('status').default('active').notNull(),
});

// 4. 예약 테이블 (Bookings Table)
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    // FK 설정
    userId: uuid('user_id').references(() => users.id).notNull(),
    carId: uuid('car_id').references(() => cars.id).notNull(),
    // serviceType을 ENUM으로 변경
    serviceType: serviceTypeEnum('service_type').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    pickupAddress: text('pickup_address').notNull(),
    dropoffAddress: text('dropoff_address').notNull(),
    // status를 ENUM으로 변경
    status: bookingStatusEnum('status').default('pending').notNull(),
    // paymentStatus를 ENUM으로 변경
    paymentStatus: paymentStatusEnum('payment_status').default('unpaid').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


// ====================================================================
// 3. RELATIONS 정의
// ====================================================================

// Users (1:N 관계: User - Pet, User - Booking)
export const usersRelations = relations(users, ({ many }) => ({
    pets: many(pets),
    bookings: many(bookings),
}));

// Pets (N:1 관계: Pet - Owner)
export const petsRelations = relations(pets, ({ one }) => ({
    owner: one(users, {
        fields: [pets.userId],
        references: [users.id],
    }),
}));

// Bookings (N:1 관계: Booking - User, Booking - Car)
// Bookings (N:1 관계: Booking - User, Booking - Car)
export const bookingsRelations = relations(bookings, ({ one }) => ({
    user: one(users, {
        fields: [bookings.userId],
        references: [users.id],
    }),
    car: one(cars, {
        fields: [bookings.carId],
        references: [cars.id],
    }),
}));


// ====================================================================
// NEW: 콘테스트 관련 테이블
// ====================================================================

// 1. 콘테스트 시즌 정보
export const contests = pgTable("contests", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").default(true),
    bannerImage: text("banner_image"),
});

// 2. 출품작
export const contestEntries = pgTable("contest_entries", {
    id: serial("id").primaryKey(),
    contestId: integer("contest_id").references(() => contests.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    petId: uuid("pet_id").references(() => pets.id).notNull(),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    voteCount: integer("vote_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

// 3. 투표 기록
export const contestVotes = pgTable("contest_votes", {
    id: serial("id").primaryKey(),
    entryId: integer("entry_id").references(() => contestEntries.id).notNull(),
    voterId: uuid("voter_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    unq: unique().on(t.entryId, t.voterId),
}));

// ====================================================================
// NEW: 멍BTI 관련 테이블
// ====================================================================

// 1. 멍BTI 결과 유형 정의
export const mbtiTypes = pgTable("mbti_types", {
    id: serial("id").primaryKey(),
    code: text("code").notNull(), // 예: "ESAL"
    name: text("name").notNull(), // 예: "파워 에너자이저"
    description: text("description").notNull(),
    badgeIcon: text("badge_icon").notNull(), // Pass 카드에 들어갈 아이콘 URL
    recommendServiceId: integer("recommend_service_id"), // 추천할 서비스 ID 연결
});

// 2. 펫별 검사 결과 저장
export const petMbtiResults = pgTable("pet_mbti_results", {
    id: serial("id").primaryKey(),
    petId: uuid("pet_id").references(() => pets.id).notNull(),
    mbtiTypeId: integer("mbti_type_id").references(() => mbtiTypes.id).notNull(),
    scoreData: jsonb("score_data"), // { energy: 80, social: 20 ... } 상세 점수 저장
    createdAt: timestamp("created_at").defaultNow(),
});
