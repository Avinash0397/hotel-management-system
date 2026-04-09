package com.booking.booking_service.service;

import com.booking.booking_service.entity.Coupon;
import com.booking.booking_service.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public Coupon createCoupon(Coupon coupon) {
        coupon.setActive(true);
        coupon.setUsedCount(0);
        return couponRepository.save(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Map<String, Object> validateCoupon(String code, Double amount) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

        if (!coupon.getActive()) throw new RuntimeException("Coupon is inactive");
        if (coupon.getExpiryDate().isBefore(LocalDate.now())) throw new RuntimeException("Coupon expired");
        if (coupon.getUsedCount() >= coupon.getUsageLimit()) throw new RuntimeException("Coupon usage limit reached");

        double discount = Math.min(amount * coupon.getDiscountPercent() / 100, coupon.getMaxDiscount());
        double finalAmount = amount - discount;

        return Map.of(
            "valid", true,
            "discount", discount,
            "finalAmount", finalAmount,
            "couponId", coupon.getId(),
            "message", "Coupon applied! You save ₹" + String.format("%.0f", discount)
        );
    }

    public Coupon applyCoupon(UUID couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        if (coupon.getUsedCount() >= coupon.getUsageLimit()) coupon.setActive(false);
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(UUID id) {
        couponRepository.deleteById(id);
    }
}
