import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { signOutAction, deletePetAction } from "@/actions/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Plus, Trash2 } from "lucide-react";
import { AddPetDialog } from "./add-pet-dialog"; // Will create next

export default async function MyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profile = await db.query.users.findFirst({
        where: (p, { eq }) => eq(p.id, user.id),
        with: {
            pets: true,
        },
    });

    if (!profile) return <div>Load Error...</div>;

    return (
        <div className="min-h-screen bg-bg-main p-6 pb-24 space-y-8 text-white">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">마이페이지</h1>
                <form action={signOutAction}>
                    <button className="text-gray-400 hover:text-red-500 transition-colors bg-[#2C2C2E] p-2 rounded-full border border-[#333]">
                        <LogOut size={18} />
                    </button>
                </form>
            </header>

            {/* Profile Card */}
            <div className="flex items-center gap-4 bg-bg-card p-5 rounded-[20px] shadow-lg border border-[#333] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-petudy-lime/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="w-16 h-16 bg-[#2C2C2E] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#333] group-hover:border-petudy-lime transition-colors">
                    {profile.avatarUrl ? (
                        <Image src={profile.avatarUrl} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                        <User size={30} className="text-gray-500" />
                    )}
                </div>
                <div className="relative z-10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {profile.nickname}
                        <span className="text-[10px] bg-petudy-lime/20 text-petudy-lime px-2 py-0.5 rounded-full border border-petudy-lime/30">MEMBER</span>
                    </h2>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
            </div>

            {/* Pets Section */}
            <div>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        내 반려동물
                        <span className="text-xs bg-[#2C2C2E] text-gray-400 px-2 py-0.5 rounded-full border border-[#333]">{profile.pets.length}</span>
                    </h3>
                    <AddPetDialog />
                </div>

                <div className="space-y-3">
                    {profile.pets.length === 0 ? (
                        <div className="text-center py-10 bg-bg-card rounded-[20px] border border-dashed border-[#444] flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-[#2C2C2E] rounded-full flex items-center justify-center mb-3">
                                <Plus size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">등록된 반려동물이 없습니다.</p>
                            <p className="text-gray-600 text-xs mt-1">아이를 등록하고 맞춤 서비스를 받아보세요!</p>
                        </div>
                    ) : (
                        profile.pets.map((pet) => (
                            <div key={pet.id} className="bg-bg-card p-5 rounded-[20px] border border-[#333] flex justify-between items-center shadow-lg hover:border-petudy-lime/30 transition-colors group">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-[#2C2C2E] rounded-full flex items-center justify-center text-2xl border border-[#333] group-hover:scale-110 transition-transform">
                                        {pet.species === 'DOG' ? '🐶' : pet.species === 'CAT' ? '🐱' : '🐾'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg flex items-center gap-2">
                                            {pet.petName}
                                            {/* Gender Badge */}
                                            {pet.gender && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${pet.gender === 'MALE'
                                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                                    }`}>
                                                    {pet.gender === 'MALE' ? '남' : '여'}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {pet.weightKg}kg <span className="text-[#333] mx-1">|</span> {pet.species === 'DOG' ? '강아지' : '고양이'} <span className="text-[#333] mx-1">|</span> {pet.breed}
                                        </p>
                                    </div>
                                </div>
                                <form action={deletePetAction.bind(null, pet.id)}>
                                    <button className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
