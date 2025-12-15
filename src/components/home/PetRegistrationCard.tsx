"use client";

import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PetRegistrationCard() {
    return (
        <Link href="/register">
            <div className="glass rounded-2xl p-6 flex items-center justify-between text-gray-900 cursor-pointer hover:bg-white/20 transition-colors shadow-sm hover:shadow-md">
                <div>
                    <h3 className="text-lg font-bold mb-1">우리 아이 등록하기</h3>
                    <p className="text-sm text-gray-600 leading-tight">
                        반려동물 정보를 입력하고<br />
                        맞춤형 서비스를 받아보세요.
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                    <Plus className="w-6 h-6 text-gray-700" />
                </div>
            </div>
        </Link>
    );
}
