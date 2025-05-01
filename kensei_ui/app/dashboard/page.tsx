"use client";

import {
  ArrowDown,
  ArrowUp,
  FileText,
  MessageSquare,
  Plus,
  Twitter,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("1W");

  // Mock data for portfolio overview
  const portfolioValue = 78425.03;
  const portfolioChange = 12.5;
  const portfolioChangeAmount = 8725.03;

  // Mock data for stats
  const stats = [
    {
      title: "Total Tokens",
      value: "10",
      icon: Plus,
      color: "bg-[#c0ff00]",
    },
    {
      title: "Total Proposals",
      value: "5",
      icon: FileText,
      color: "bg-[#c0ff00]",
    },
    {
      title: "Total Tweets",
      value: "42",
      icon: Twitter,
      color: "bg-[#c0ff00]",
    },
    {
      title: "Chat Sessions",
      value: "8",
      icon: MessageSquare,
      color: "bg-[#c0ff00]",
    },
  ];

  // Mock data for top holdings
  const topHoldings = [
    {
      name: "Pepe",
      symbol: "PEPE",
      logo: "/happy-frog-on-a-lilypad.png",
      value: 43500.0,
      change: 81.25,
      holdings: "500000000.00",
    },
    {
      name: "Doge",
      symbol: "DOGE",
      logo: "/alert-shiba.png",
      value: 12000.0,
      change: 33.3,
      holdings: "10000.00",
    },
    {
      name: "Cat Coin",
      symbol: "CAT",
      logo: "/playful-calico.png",
      value: 7800.0,
      change: 85.7,
      holdings: "1000.00",
    },
  ];

  // Mock data for recent proposals
  const recentProposals = [
    {
      id: "prop-1",
      title: "PEPE01: Increase Marketing Budget for Community Growth",
      status: "active",
      token: "PEPE",
      tokenLogo: "/happy-frog-on-a-lilypad.png",
      endDate: "2025-05-01",
    },
    {
      id: "prop-2",
      title: "DOGE02: Revisiting The DOGE Staking Mechanism",
      status: "closed",
      token: "DOGE",
      tokenLogo: "/alert-shiba.png",
      endDate: "2025-04-01",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white">Dashboard</h1>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white rounded-3xl p-6 mb-6 border-4 border-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-black">Portfolio Overview</h2>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "1Y", "ALL"].map((time) => (
              <button
                key={time}
                className={`px-3 py-1 rounded-xl font-bold border-2 border-black text-black ${
                  timeframe === time ? "bg-[#c0ff00]" : "bg-gray-100"
                }`}
                onClick={() => setTimeframe(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-2">
              <div className="text-gray-500 text-sm">Total Value</div>
              <div className="text-4xl font-black text-black">
                ${portfolioValue.toLocaleString()}
              </div>
              <div
                className={`flex items-center ${
                  portfolioChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {portfolioChange >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span className="font-bold">
                  {Math.abs(portfolioChange).toFixed(2)}%
                </span>
                <span className="ml-1">
                  (${Math.abs(portfolioChangeAmount).toLocaleString()})
                </span>
              </div>
            </div>

            <div className="h-[200px] bg-gray-100 rounded-xl border-4 border-black flex items-center justify-center">
              <div className="text-gray-400">Portfolio Chart</div>
            </div>
          </div>

          <div className="w-64 space-y-4">
            <div className="bg-[#0039C6] rounded-xl p-4 border-4 border-black">
              <div className="text-white text-sm mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard/wallet"
                  className="bg-[#c0ff00] text-black p-3 rounded-xl border-2 border-black flex flex-col items-center"
                >
                  <Wallet size={24} />
                  <span className="text-xs font-bold mt-1">My Wallet</span>
                </Link>
                <Link
                  href="/dashboard/proposals"
                  className="bg-[#c0ff00] text-black p-3 rounded-xl border-2 border-black flex flex-col items-center"
                >
                  <FileText size={24} />
                  <span className="text-xs font-bold mt-1">Proposals</span>
                </Link>
                <Link
                  href="/dashboard/tweets"
                  className="bg-[#c0ff00] text-black p-3 rounded-xl border-2 border-black flex flex-col items-center"
                >
                  <Twitter size={24} />
                  <span className="text-xs font-bold mt-1">Tweets</span>
                </Link>
                <Link
                  href="/dashboard/chatbot"
                  className="bg-[#c0ff00] text-black p-3 rounded-xl border-2 border-black flex flex-col items-center"
                >
                  <MessageSquare size={24} />
                  <span className="text-xs font-bold mt-1">Chat Bot</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border-4 border-black"
          >
            <div className="flex items-center gap-3">
              <div
                className={`${stat.color} p-3 rounded-xl border-2 border-black`}
              >
                <stat.icon size={24} className="text-black" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">{stat.title}</div>
                <div className="text-2xl font-black text-black">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Holdings */}
        <div className="bg-white rounded-3xl p-6 border-4 border-black">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-black">Top Holdings</h2>
            <Link
              href="/dashboard/wallet"
              className="bg-[#c0ff00] text-black px-3 py-1 rounded-xl text-sm font-bold border-2 border-black"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {topHoldings.map((holding, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-xl border-2 border-black"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black">
                    <div className="relative w-10 h-10">
                      <Image
                        src={holding.logo || "/placeholder.svg"}
                        alt={holding.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a default icon if image fails to load
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/%3E%3Cpath d='M12 17h.01'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-black">{holding.name}</div>
                    <div className="text-gray-500 text-sm">
                      {holding.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-black">
                    ${holding.value.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm ${
                      holding.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {holding.change >= 0 ? "+" : ""}
                    {holding.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white rounded-3xl p-6 border-4 border-black">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-black">Recent Proposals</h2>
            <Link
              href="/dashboard/proposals"
              className="bg-[#c0ff00] text-black px-3 py-1 rounded-xl text-sm font-bold border-2 border-black"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentProposals.map((proposal, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 rounded-xl border-2 border-black"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-black">
                      <div className="relative w-8 h-8">
                        <Image
                          src={proposal.tokenLogo || "/placeholder.svg"}
                          alt={proposal.token}
                          width={32}
                          height={32}
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to a default icon if image fails to load
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/%3E%3Cpath d='M12 17h.01'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-black">{proposal.token}</div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        proposal.status === "active"
                          ? "bg-[#c0ff00] text-black"
                          : proposal.status === "closed"
                          ? "bg-red-500 text-white"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {proposal.status.charAt(0).toUpperCase() +
                        proposal.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Ends: {proposal.endDate}
                  </div>
                </div>
                <div className="font-medium text-black">{proposal.title}</div>
                <div className="mt-2">
                  <Link
                    href={`/marketplace/${proposal.token.toLowerCase()}/proposal/${
                      proposal.id
                    }`}
                    className="text-[#0039C6] text-sm font-bold hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
